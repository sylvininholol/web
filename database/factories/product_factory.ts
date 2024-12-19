import factory from '@adonisjs/lucid/factories'
import Product from '#models/Product'
import { CategoryFactory } from '#database/factories/category_factory'
import { ImageFactory } from '#database/factories/image_factory'

export const ProductFactory = factory
  .define(Product, async ({ faker }) => ({
    name: faker.commerce.productName(),
    price: faker.number.float({ min: 0, max: 1000, fractionDigits: 2 }),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 0, max: 100 }),
  }))
  .relation('category', () => CategoryFactory)
  .relation('images', () => ImageFactory)
  .build()
