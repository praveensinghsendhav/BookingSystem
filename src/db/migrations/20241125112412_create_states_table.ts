import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('states', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).notNullable().unique();
        table.string('name', 100).notNullable();
        table.integer('country_id').unsigned().notNullable()
            .references('id').inTable('countries')
            .onDelete('CASCADE').onUpdate('CASCADE');
        table.unique(['name', 'country_id']);
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('states');
};
