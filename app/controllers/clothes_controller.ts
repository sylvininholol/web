import { HttpContext } from "@adonisjs/core/http"
import { CategoryRoutes, CategoryTitles } from "../enums/CategoryRoutesEnum.js";
import Product from "#models/product"

export default class ClothesController {

    private removerAcentos(texto: string) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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

    public async viewCategory({ params, view }: HttpContext) {
        const category = params.category.toUpperCase(); // Recebe a categoria da rota
        const categoryRoute: any = CategoryRoutes[category as keyof typeof CategoryRoutes] || "erro";
        const products = await Product.query().where('category', categoryRoute).exec();
        const categoryTitle: any = CategoryTitles[category as keyof typeof CategoryTitles] || "erro"
        const texto: string = this.removerAcentos(categoryTitle)

        const processedProducts = this.processProducts(products)

        return view.render('pages/roupas/index', {
            products: processedProducts,
            categoryTitle: categoryTitle,
            categoryRoute: texto
        });
    }

    public async viewProducts({ params, view }: HttpContext) {
        const category = params.category.toUpperCase()
        const product = await Product.findOrFail(params.id);

        let productLinks = [];
        if (typeof product.productLinks === 'string') {
            productLinks = JSON.parse(product.productLinks);
        }

        return view.render('pages/roupas/details', {
            product: {
              ...product.toJSON(),
              productLinks,
              category
            },
          })
    }
}