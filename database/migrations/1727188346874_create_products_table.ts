import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.text('description').notNullable()

      table.decimal('price', 10, 2).notNullable()
      table.integer('stock').notNullable().defaultTo(0)

      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('CASCADE')

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
