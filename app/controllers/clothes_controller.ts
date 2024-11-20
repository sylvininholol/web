import { HttpContext } from "@adonisjs/core/http"
import { CategoryRoutes } from "../enums/CategoryRoutesEnum.js";
import Product from "#models/product"

export default class ClothesController {

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
        const categoryRoute: any = CategoryRoutes[category as keyof typeof CategoryRoutes];
        const products = await Product.query().where('category', categoryRoute).exec();
        const categoryTitle = category.charAt(0) + category.slice(1).toLowerCase();

        const processedProducts = this.processProducts(products)

        return view.render('pages/roupas/index', {
            products: processedProducts,
            categoryTitle: categoryTitle
        });
    }
}