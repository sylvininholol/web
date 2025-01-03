import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const ClothesController = () => import('#controllers/clothes_controller')
const CartController = () => import('#controllers/cart_controller')

/**
 * Rotas de Views
 */
router.get('/login', [UsersController, 'goToLoginPage']).as('loginPage')

router
  .group(() => {
    router
      .group(() => {
        //Rota principal
        router.get('/', [ProductsController, 'viewHome']).as('home')

        //Rotas de roupas
        router.get('/categorias/:category/roupas', [ClothesController, 'viewCategory']).as('roupas')
        router
          .get('/categorias/:category/roupas/:id', [ClothesController, 'viewProducts'])
          .as('viewProducts')

        router
          .get('/finalizar-compra', async ({ view }) => view.render('pages/finalizar-compra/index'))
          .as('checkout')
      })
      .middleware([middleware.cart()])

    // Rotas de Views para Produtos
    router
      .group(() => {
        router.get('/create', [ProductsController, 'showCreate']).as('products.create.show')
        router.get('/', [ProductsController, 'viewProducts']).as('products.viewProducts')
        router.patch('/:id/stock', [ProductsController, 'updateStock']).as('products.updateStock')
        router.delete('/:id', [ProductsController, 'deleteProduct']).as('products.destroy')
      })
      .prefix('products')
      .as('products')
      .use([middleware.silentAuth(), middleware.admin()])
  })
  .use(middleware.categories())

// Rotas de registro de usuário
router.get('/registrar', [UsersController, 'showRegister']).as('registrar.show')
router.post('/registrar', [UsersController, 'register']).as('registrar')

//Rota de minha conta
router.get('/minha-conta', [UsersController, 'showProfile']).use(middleware.auth()).as('user.show')
router.post('/minha-conta/update-email', [UsersController, 'updateEmail']).use(middleware.auth())
router
  .post('/minha-conta/update-password', [UsersController, 'updatePassword'])
  .use(middleware.auth())

//Rota de Logout
router
  .post('/logout', async ({ auth, response }) => {
    await auth.use('web').logout()
    return response.redirect('/')
  })
  .as('logout')
  .use(middleware.auth())

router
  .get('/joao', async ({ auth }) => {
    console.log(auth.user)
  })
  .use(middleware.auth())

/**
 * Rotas de API
 */
router
  .group(() => {
    // Rotas de autenticação na API
    router.post('/login', [UsersController, 'login']).as('api.login')

    router
      .group(() => {
        router.post('adicionar', [CartController, 'addToCart']).as('api.cart.addToCart')
        router.post('remover', [CartController, 'removeFromCart']).as('api.cart.removeFromCart')
        router.post('finalizar-compra', [CartController, 'checkout']).as('api.cart.checkout')
        router.delete('/', [CartController, 'clearCart']).as('api.cart.clearCart')
      })
      .prefix('carrinho')
      .as('api.cart')

    // Rotas de API para Produtos
    router
      .group(() => {
        router.get('/', [ProductsController, 'index']).as('api.products.index')
        router
          .get('/:id', [ProductsController, 'show'])
          .where('id', router.matchers.number())
          .as('api.products.show')
        router.post('/create', [ProductsController, 'store']).as('api.products.store')
        router
          .delete('/:id', [ProductsController, 'destroy'])
          .where('id', router.matchers.number())
          .as('api.products.destroy')
        router
          .patch('/:id', [ProductsController, 'patch'])
          .where('id', router.matchers.number())
          .as('api.products.patch')
      })
      .prefix('products')
      .as('api.products')
  })
  .prefix('api')
  .as('api')
