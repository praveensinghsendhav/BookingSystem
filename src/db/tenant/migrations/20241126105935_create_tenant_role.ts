import type { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

// Create roles table
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('roles', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.string('name', 50).notNullable();
        table.text('description');
        table.timestamps(true, true);
    }).then(() => {
        // Insert default roles immediately after table creation
        return knex('roles').insert([
            {
                uuid: uuidv4(),
                name: 'superadmin',
                description: 'Full access to all features and settings.',
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
            }
        ]);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('roles');
};
