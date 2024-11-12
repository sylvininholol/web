import { HttpContext } from "@adonisjs/core/http"

import Product from "#models/product"

export default class ProductsController {
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1);
      const limit = 10;
  
      const payload = request.only(['name']);
  
      const query = Product.query();
  
      if (payload.name && payload.name.length > 0) {
        query.where('name', 'like', `%${payload.name}%`);
      }
  
      const products = await query.paginate(page, limit);
  
      return products;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return response.status(500).json({ message: 'Erro ao buscar produtos' });
    }
  }
  

  async show({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    return product
  }

  async store({ request, response }: HttpContext) {
    const payload = request.only(['name', 'price', 'description'])
  
    const product = await Product.create(payload)
  
    return response.redirect().toRoute('/products') // Certifique-se que está redirecionando para a rota correta
  }

  async patch({ params, request}: HttpContext) {
    const product = await Product.findOrFail(params.id)

    const payload = await request.only(['name', 'price', 'description'])
    product.merge(payload)

    await product.save()

    return product
  }

  async destroy({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    await product.delete()

    return { sucess: `${params.id} removido`}
  }

  public async showCreate({view}: HttpContext) {
    return view.render('pages/product/create')
  }

  public async viewProducts({view}: HttpContext) {
    return view.render('pages/product/show')
  }
}
