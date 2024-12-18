import { CategoryFactory } from '#database/factories/category_factory'
import { ProductFactory } from '#database/factories/product_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const categories = await CategoryFactory.createMany(3)
    await ProductFactory.merge({
      categoryId: categories[Math.floor(Math.random() * categories.length)].id,
    }).with('images', 5).createMany(10)
  }
}
