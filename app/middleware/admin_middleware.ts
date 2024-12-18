import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {

    console.log(ctx.auth.user)

    if (ctx.auth?.user?.admin) {
      return await next()
    }

    return ctx.response.redirect('/')
  }
}