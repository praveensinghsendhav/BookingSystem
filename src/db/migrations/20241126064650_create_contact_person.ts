import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('contact_person', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).notNullable().unique();
        table.string('firstname', 100).notNullable();
        table.string('lastname', 100).nullable();
        table.string('email', 150).notNullable().unique();
        table.string('phone', 20).notNullable();
        table.string('alternative_phone', 20).nullable();
        table.integer('tenant_id').unsigned().notNullable()
            .references('id').inTable('tenants')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('contact_person');
}
