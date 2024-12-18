import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Product from '#models/Product'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare categoryId: number

  @hasMany(() => Product)
  declare products: HasMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
