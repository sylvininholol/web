import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Category from '#models/Category'
import Image from '#models/Image'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare stock: number

  @column()
  declare categoryId: number

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @manyToMany(() => Image, {
    localKey: 'id',
    pivotForeignKey: 'product_id',
    pivotRelatedForeignKey: 'image_id',
    relatedKey: 'id',
    pivotTable: 'product_images',
  })
  declare images: ManyToMany<typeof Image>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
