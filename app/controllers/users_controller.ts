import Hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register'

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

    const user = await User.findBy('email', email);

    if (user && (await Hash.verify(user.password, password))) {
      await auth.use('web').login(user);
      auth.authenticate()
      return response.redirect().toRoute("/");
    }
    return response.status(401).send({ message: 'Credenciais inválidas' });
  }

  goToLoginPage({ view }: HttpContext) {
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

  public async register({ request, response}: HttpContext) {
    
    //grab request data
    const data = request.only(['full_name', 'email', 'password'])

    //create user
    const validadedData = await registerValidator.validate(data)

    const user = await User.create(validadedData)

    console.log({user: user.serialize()})

    return response.redirect('/login')
  } 

  public async userProfile({request}: HttpContext)
  {
    const data = request.only(['full_name', 'email', 'password'])

    
  }

  public async showRegister({view}: HttpContext) {
    return view.render('pages/register/index')
  }

  public async showProfile({ auth, view }: HttpContext) {
    try {
      const user = auth.user

      if (!user) {
        return view.render('errors/server_error') // Renderiza uma página de erro, se necessário
      }

      return view.render('pages/profile/account', { user })
    } catch (error) {
      console.error(error)
      return view.render('errors/server_error') // Renderiza uma página de erro genérico
    }
  }

  public async updateEmail({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user;
  
      // Verificando se o usuário está autenticado
      if (!user) {
        return response.unauthorized('Você precisa estar autenticado');
      }
  
      // Obtendo os dados do formulário para email
      const { new_email, confirm_email } = request.only(['new_email', 'confirm_email']);
  
      // Verificando se os e-mails coincidem
      if (new_email !== confirm_email) {
        return response.badRequest('Os e-mails não coincidem');
      }

      // Validando o novo e-mail
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(new_email)) {
        return response.badRequest('E-mail inválido');
      }
  
      // Atribuindo o novo e-mail ao usuário
      user.email = new_email;
  
      // Salvando a atualização do usuário no banco de dados
      await user.save();
  
      // Redirecionando o usuário para o perfil atualizado
      return response.redirect().toRoute('user.show');
    } catch (error) {
      console.error(error);
      return response.internalServerError('Erro ao atualizar perfil');
    }
  }

  public async updatePassword({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user;
  
      // Verificando se o usuário está autenticado
      if (!user) {
        return response.unauthorized('Você precisa estar autenticado');
      }
  
      // Obtendo dados do formulário para a senha
      const { current_password, new_password, confirm_password } = request.only(['current_password', 'new_password', 'confirm_password']);
      
      // Verificando se as senhas coincidem
      if (new_password !== confirm_password) {
        return response.badRequest('As senhas não coincidem');
      }
  
      // Verificando se a senha atual está correta
      const isCurrentPasswordValid = await Hash.verify(user.password, current_password);
      if (!isCurrentPasswordValid) {
        return response.badRequest('A senha atual está incorreta');
      }
  
      // Atualizando a senha do usuário
      user.password = new_password;
  
      // Salvando a atualização da senha no banco de dados
      await user.save();
  
      // Redirecionando o usuário para o perfil atualizado
      return response.redirect().toRoute('user.show');
    } catch (error) {
      console.error(error);
      return response.internalServerError('Erro ao atualizar senha');
    }
  }  

}
