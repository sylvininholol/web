import factory from '@adonisjs/lucid/factories'
import Category from '#models/Category'
import { ProductFactory } from '#database/factories/product_factory'

export const CategoryFactory = factory
  .define(Category, async ({ faker }) => ({
    name: faker.commerce.department(),
  }))
  .relation('products', () => ProductFactory)
  .build()
