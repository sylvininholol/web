import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      fullName: 'John Doe',
      email: 'john@gmail.com',
      password: 'alo123',
    })
  }
}
