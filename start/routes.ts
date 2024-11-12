import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')

/**
 * Rotas de Views
 */
router.get('/login', [UsersController, 'goToLoginPage']).as('loginPage')

// Rotas de registro de usuário
router.get('/register', [UsersController, 'showRegister']).as('register.show')
router.post('/register', [UsersController, 'register']).as('register')

// Rotas de Views para Produtos
router.group(() => {
  router.get('/create', [ProductsController, 'showCreate']).as('products.create.show')
  router.get('/', [ProductsController, 'viewProducts']).as('products.viewProducts')
})
.prefix('products')
.as('products')

/**
 * Rotas de API
 */
router.group(() => {
  
  // Rotas de autenticação na API
  router.post('/login', [UsersController, 'login']).as('api.login')
  
  // Rotas de API para Usuários
  router.group(() => {
    router.get('/', [UsersController, 'index']).as('api.users.index')
    router.get('/:id', [UsersController, 'show'])
      .where('id', router.matchers.number())
      .as('api.users.show')
    router.post('/', [UsersController, 'create']).as('api.users.create')
  })
  .prefix('users')
  .as('api.users')

  // Rotas de API para Produtos
  router.group(() => {
    router.get('/', [ProductsController, 'index']).as('api.products.index')
    router.get('/:id', [ProductsController, 'show'])
      .where('id', router.matchers.number())
      .as('api.products.show')
    router.post('/create', [ProductsController, 'store']).as('api.products.store')
    router.delete('/:id', [ProductsController, 'destroy'])
      .where('id', router.matchers.number())
      .as('api.products.destroy')
    router.patch('/:id', [ProductsController, 'patch'])
      .where('id', router.matchers.number())
      .as('api.products.patch')
  })
  .prefix('products')
  .as('api.products')

})
.prefix('api')
.as('api')
