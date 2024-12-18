import { HttpContext } from '@adonisjs/core/http'
import Product from '#models/Product'
import Category from '#models/Category'

export default class ClothesController {
  public async viewCategory({ params, view }: HttpContext) {
    const categoryId = params.category

    const category = await Category.query()
      .where('id', categoryId)
      .preload('products', (productsQuery) => productsQuery.preload('images'))
      .first()

    return view.render('pages/categorias/index', {
      category,
    })
  }

  public async viewProducts({ params, view }: HttpContext) {
    const categoryId = params.category

    const category = await Category.query().where('id', categoryId).first()

    if (!category) {
      return view.render('pages/categorias/roupas/index', {
        category,
      })
    }

    const productId = params.id

    const product = await Product.query().where('id', productId).preload('images').first()

    return view.render('pages/categorias/roupas/index', {
      category,
      product,
    })
  }
}
