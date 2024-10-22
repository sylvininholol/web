import Hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { messages } from '@vinejs/vine/defaults'
let sequence = 2

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'doe@gmail.com',
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'doe@gmail.com',
  },
]

export default class UsersController {
  index() {
    return users
  }

  async login({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password']);
    console.log("Ué")
  
    const user = await User.findBy('email', email);
  
    if (user && (await Hash.verify(user.password, password))) {
      await auth.use('web').login(user);
      console.log("DEU CERTO")
      return response.redirect('/users');
    }
    console.log("DEU ERRADO")
    return response.status(401).send({ message: 'Credenciais inválidas' });
  }
  
  
  goToLoginPage({ view }: HttpContext){
    console.log("LOGINPAGE")
    return view.render('pages/login/index')
  }

  create({ request, response }: HttpContext) {
    const user = request.only(['name', 'email'])

    sequence += 1

    users.push({
      id: sequence,
      ...user,
    })

    return response.redirect().toRoute('users.show', { id: sequence })
  }

  show({ params, response }: HttpContext) {
    const id = params.id

    if (id === null) {
      response.status(400)

      return { message: 'id eh obrigatorio' }
    }

    for (const user of users) {
      if (user.id === id) {
        return user
      }
    }

    response.status(404)

    return { message: 'not found' }
  }
}
