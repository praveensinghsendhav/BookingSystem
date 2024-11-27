import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('cities', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).notNullable().unique();
        table.string('name', 100).notNullable();
        table.integer('state_id').unsigned().notNullable()
            .references('id').inTable('states')
            .onDelete('CASCADE').onUpdate('CASCADE');
        table.unique(['name', 'state_id']);
        table.timestamps(true, true);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('cities');
};
