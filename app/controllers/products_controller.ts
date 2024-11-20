import { HttpContext } from "@adonisjs/core/http"

import Product from "#models/product"
import { CategoryTitles } from "../enums/CategoryRoutesEnum.js";

export default class ProductsController {

  private removerAcentos(texto: string) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  private mapCategoryRoutes(products: Product[]) {
    return products.map((product) => {
        const category = product.category.toUpperCase();
        const mappedCategory = this.categoryToRoute(category);
        return { id: product.id, category: mappedCategory };
    });
}


  private categoryToRoute(category: string): string {
    const mapCategories: Record<string, string> = {
      CAMISETA: "camisetas",
      REGATA: "regatas",
      CALÇA: "calcas",
      UNDERWEAR: "underwear",
      SHORT: "shorts",
      MEIA: "meia",
      CASACO: "casacos",
      TÊNIS: "tenis",
      BONÉ: "bones"
    };
  
    return (
      mapCategories[category.toUpperCase()] || 
      category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );
  }
  

  private processProducts(products: Product[]) {
    return products.map((product) => {
      let links = [];

      if (typeof product.productLinks === 'string') {
        links = JSON.parse(product.productLinks);
      } else if (Array.isArray(product.productLinks)) {
        links = product.productLinks;
      }

      return {
        ...product.toJSON(),
        product_links: links,
      };
    });
  }

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
    const payload = request.only(['name', 'price', 'description', 'category', 'product_links'])

    if (payload.product_links && Array.isArray(payload.product_links)) {
      payload.product_links = JSON.stringify(payload.product_links) // Converte o array para string JSON
    }

    const product = await Product.create(payload)

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
    const products = await Product.all()

    const processedProducts = this.processProducts(products)

    return view.render('pages/product/show', { products: processedProducts })
  }

  public async viewHome({ view }: HttpContext) {

    const products = await Product.all()

    const processedProducts = this.processProducts(products)

    const categoryToRoute = this.categoryToRoute;

    return view.render('pages/home/index', { products: processedProducts, categoryToRoute })
  }
}
