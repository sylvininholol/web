import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.decimal('price', 10, 2).notNullable()
      table.text('description').notNullable()
      table.enum('category', [
        'CAMISETA', 'REGATA', 'CALÇA', 'UNDERWEAR', 'SHORT', 'MEIA', 'CASACO', 'TÊNIS', 'BONÉ',
      ]).notNullable()
      table.json('product_links').notNullable()

      table.timestamps(true, true) // created_at e updated_at automáticos
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
