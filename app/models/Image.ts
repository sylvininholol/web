import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Product from '#models/Product'

export default class Image extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare imageUrl: string

  @manyToMany(() => Product, {
    localKey: 'id',
    pivotForeignKey: 'image_id',
    pivotRelatedForeignKey: 'product_id',
    relatedKey: 'id',
    pivotTable: 'product_images',
  })
  declare products: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
