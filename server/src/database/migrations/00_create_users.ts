import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.string('avatar');
    table.string('resetPasswordToken');
    table.dateTime('resetPasswordTokenExpires');
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('users');
}