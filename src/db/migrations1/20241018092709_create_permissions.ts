import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('permissions', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).unique().notNullable();
        table.string('name').notNullable();
        table.text('description');
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('permissions');
};
