module.exports = {
  test: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    database: 'database_test',
    host: 'postgres',
    dialect: 'postgres',
  },
}
