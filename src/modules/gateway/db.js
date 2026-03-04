import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'back_chain',
  password: '1234556',
  port: 5432
})

pool.on('connect', () => {
  console.log('Conectado a PostgreSQL')
})

export default pool