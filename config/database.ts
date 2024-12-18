import { DatabaseConfig } from '@adonisjs/lucid/types/database'

const databaseConfig: DatabaseConfig = {
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: './database.sqlite3',
      },
      useNullAsDefault: true,
    },
  },
}

export default databaseConfig
