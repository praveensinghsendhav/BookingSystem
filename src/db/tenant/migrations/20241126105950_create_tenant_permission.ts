import type { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

// Create permissions table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('permissions', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.string('name', 50).notNullable();
        table.text('description');
        table.timestamps(true, true);
    }).then(() => {
        // Insert default permissions immediately after table creation
        return knex('permissions').insert([
            {
                uuid: uuidv4(),
                name: 'manage_users',
                description: 'Permission to create, update, and delete users',
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
            },
            {
                uuid: uuidv4(),
                name: 'manage_roles',
                description: 'Permission to create, update, and delete roles',
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
            },
            {
                uuid: uuidv4(),
                name: 'manage_permissions',
                description: 'Permission to create, update, and delete permissions',
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
            }
        ]);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('permissions');
};
