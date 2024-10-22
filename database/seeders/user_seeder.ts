import Hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Criar um novo usuário
    await User.create({
      fullName: 'John Doe',
      email: 'doe@gmail.com',
      password: await Hash.make('password123'), // Certifique-se de hashear a senha
    })
  }
}
