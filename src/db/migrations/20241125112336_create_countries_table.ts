import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('countries', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).notNullable().unique();
        table.integer('country_code').unique().notNullable(); // Numeric country code
        table.string('name', 100).notNullable().unique();
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('countries');
};
