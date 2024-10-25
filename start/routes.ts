/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')

router.get('/login', [UsersController, 'goToLoginPage']).as('loginPage')

//Rotas de registro
router.get('/register', [UsersController, 'showRegister']).as('register.show')
router.post('/register', [UsersController, 'register']).as('register')

router
  .group(() => {
    router.post('/login', [UsersController, 'login']).as('login')
    router
      .group(() => {
        router.get('/', [UsersController, 'index']).as('lista')
        router.get('/:id', [UsersController, 'show']).where('id', router.matchers.number()).as('show')
        router.post('/', [UsersController, 'create']).as('create')
        router.get('/register', [UsersController, 'showRegister']).as('register.show')
      })
      .prefix('users')
      .as('users')


    router
      .group(() => {
        router.get('/products', [ProductsController, 'index']).as('products.index')
        router.get('/products/:id', [ProductsController, 'show']).as('products.show')
        router.post('/products', [ProductsController, 'store']).as('products.store')
        router.delete('/products/:id', [ProductsController, 'destroy']).as('products.destroy')
        router.patch('/products/:id', [ProductsController, 'patch']).as('products.patch')
      })
      .prefix('products')
      .as('products')
  })
  .prefix('api')
  .as('api')