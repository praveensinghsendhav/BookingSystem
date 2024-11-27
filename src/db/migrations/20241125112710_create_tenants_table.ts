import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tenants', (table) => {
        table.increments('id').primary();
        table.string('uuid', 64).notNullable().unique();
        table.string('name', 100).notNullable().unique();
        table.string('domain', 100).unique();
        table.text('logo_url').nullable();
        table.string('email', 150).notNullable();
        table.string('phone', 20).nullable();
        table.text('address').nullable();
        table.integer('country_id').unsigned().nullable()
            .references('id').inTable('countries')
            .onDelete('SET NULL').onUpdate('CASCADE');
        table.integer('state_id').unsigned().nullable()
            .references('id').inTable('states')
            .onDelete('SET NULL').onUpdate('CASCADE');
        table.integer('city_id').unsigned().nullable()
            .references('id').inTable('cities')
            .onDelete('SET NULL').onUpdate('CASCADE');
        table.string('zip_code', 15).notNullable();
        table.string('registration_number', 54).unique().nullable();
        table.string('timezone', 50).defaultTo('UTC').notNullable();
        table.tinyint('status').defaultTo(1).notNullable().comment('1=Active, 0=Inactive, -1=Blacklisted');
        table.string('billing_email', 150).nullable();
        table.json('metadata').nullable().comment('Additional data related to tenants'); // Removed default
        table.timestamp('deleted_at').nullable().comment('Soft delete timestamp');
        table.timestamps(true, true);
        // Indexes for performance
        table.index(['uuid', 'email', 'status']);
    });
};

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('tenants');
};
