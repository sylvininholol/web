import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.decimal('price', 10, 2).notNullable()
      table.text('description').notNullable()

      table.timestamps(true, true) // Adiciona automaticamente created_at e updated_at
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
