import knex, { Knex } from "knex";
import { IUser } from "@dbinterfaces";
import { addingStaff } from "../../../db/tenant/migrations/20241126110016_create_tenant_staffs";
import { existsSync } from "fs";
async function createAndMigrate(
    credentials: {
        host: string;
        user: string;
        password: string;
        database: string;
        port: number;
    },
    tenantData: IUser,
    migrationDirectory?: string,
): Promise<{ databaseCreated: boolean; migrationApplied: boolean; }> {

    console.log(migrationDirectory);
    const databaseName = credentials.database;
    console.log(databaseName);
    if (!databaseName || !/^[a-zA-Z0-9_-]+$/.test(databaseName)) {
        throw new Error(`Invalid database name: "${databaseName}".`);
    }

    let adminConnection: Knex | null = null;
    let appConnection: Knex | null = null;
    let databaseCreated = false;
    let migrationApplied = false;

    try {
        // Connect to admin DB
        adminConnection = knex({
            client: "mysql2",
            connection: {
                host: credentials.host,
                user: credentials.user,
                password: credentials.password,
                port: credentials.port,
            },
        });

        // Check and create database
        console.info(`Ensuring database: ${databaseName}`);
        await adminConnection.raw(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
        databaseCreated = true;

        // Connect to tenant DB
        appConnection = knex({
            client: "mysql2",
            connection: credentials,
            migrations: migrationDirectory ? { directory: migrationDirectory } : undefined,
        });

        // Check for migration directory existence
        if (migrationDirectory && !existsSync(migrationDirectory)) {
            throw new Error(`Migration directory not found: ${migrationDirectory}`);
        }

        // Check migration state
        const migrationsTable = await appConnection.schema.hasTable("knex_migrations");
        if (migrationsTable) {
            const pendingMigrations = await appConnection.migrate.list();
            if (pendingMigrations[1]?.length === 0) {
                console.info("All migrations are already applied.");
            } else {
                console.info("Pending migrations detected. Applying now...");
                await appConnection.migrate.latest();
                migrationApplied = true;
                console.info("Migrations applied successfully.");
            }
        } else {
            console.info("No migrations detected. Applying fresh migrations...");
            await appConnection.migrate.latest();
            migrationApplied = true;
        }

        // Insert tenant-related data if database and migrations are ready
        const [roleData] = await appConnection("roles").select("id").where({ name: "superadmin" });
        tenantData.role = roleData?.id;
        await addingStaff(appConnection, [tenantData]);

    } catch (err) {
        console.error(`Error during create and migrate: ${err.message}`);
        if (databaseCreated) {
            console.info(`Rolling back database: ${databaseName}`);
            await adminConnection?.raw(`DROP DATABASE IF EXISTS \`${databaseName}\``);
        }
        throw err;
    } finally {
        await adminConnection?.destroy();
        await appConnection?.destroy();
    }

    return { databaseCreated, migrationApplied };
}

export { createAndMigrate };
