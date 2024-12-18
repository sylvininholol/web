import Category from '#models/Category'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CategoriesMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const categoriesPagination = await Category.query().paginate(1, 10)
    const categories = await categoriesPagination.all()

    ctx.view.share({
      categories,
    })

    const output = await next()
    return output
  }
}
