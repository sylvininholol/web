import { HttpContext } from '@adonisjs/core/http'

import Product from '#models/Product'

export default class ProductsController {
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = 10

      const payload = request.only(['name'])

      const query = Product.query()

      if (payload.name && payload.name.length > 0) {
        query.where('name', 'like', `%${payload.name}%`)
      }

      const products = await query.paginate(page, limit)

      return products
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      return response.status(500).json({ message: 'Erro ao buscar produtos' })
    }
  }

  async deleteProduct({ params, response }: HttpContext) {
    const product = await Product.find(params.id)

    if (product) {
      await product.delete()
    }

    return response.redirect().toRoute('/products')
  }

  async updateStock({ params, request, response }: HttpContext) {
    const product = await Product.find(params.id)
    const payload = request.only(['stock'])

    if (!product || !payload.stock) {
      return response.redirect().toRoute('/products')
    }

    product.merge(payload)

    await product.save()

    return response.redirect().toRoute('/products')
  }

  async show({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    return product
  }

  async store({ request, response }: HttpContext) {
    const payload = request.only(['name', 'price', 'stock', 'description', 'categoryId'])
    const { images } = request.only(['images'])

    const product = await Product.create(payload)

    await product.related('images').createMany(images.map((image: string) => ({ imageUrl: image })))

    return response.redirect().toRoute('/products') // Certifique-se que está redirecionando para a rota correta
  }

  async patch({ params, request }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    const payload = await request.only(['name', 'price', 'description'])
    product.merge(payload)

    await product.save()

    return product
  }

  async destroy({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    await product.delete()

    return { sucess: `${params.id} removido` }
  }

  public async showCreate({ view }: HttpContext) {
    return view.render('pages/product/create')
  }

  public async viewProducts({ view }: HttpContext) {
    const products = await Product.query().preload('category').preload('images').exec()

    return view.render('pages/product/show', { products })
  }

  public async viewHome({ view }: HttpContext) {
    const products = await Product.query().preload('category').preload('images').exec()

    return view.render('pages/home/index', { products })
  }
}
