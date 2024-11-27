import type { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

// Create role_permissions table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('role_permissions', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
        table.integer('permission_id').unsigned().references('id').inTable('permissions').onDelete('CASCADE');
        table.timestamps(true, true);
    }).then(async () => {
        // Fetch SuperAdmin role ID and permission IDs
        const [superAdminRole] = await knex('roles').select('id').where('name', 'superadmin');
        const permissions = await knex('permissions')
            .select('id')
            .whereIn('name', ['manage_users', 'manage_roles', 'manage_permissions']);

        // Insert SuperAdmin role permissions
        const rolePermissions = permissions.map((permission) => ({
            uuid: uuidv4(),
            role_id: superAdminRole.id,
            permission_id: permission.id,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now(),
        }));

        return knex('role_permissions').insert(rolePermissions);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('role_permissions');
};
