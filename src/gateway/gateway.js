import Fastify from 'fastify';
import proxy from '@fastify/http-proxy';
import pool from './db.js'
import bcrypt from 'bcrypt'

const password = '123456'
const hashed = await bcrypt.hash(password, 10)
console.log('aqui wey el codigo que buscas')
console.log(hashed)

const fastify = Fastify({ logger: true });

await pool.query('SELECT NOW()')
console.log('DB funcionando')

// Proxy → redirige todas las rutas al servidor principal
fastify.register(proxy, {
  upstream: 'http://localhost:3000',
  prefix: '/', 
});

fastify.listen({ port: 4000 }, (err) => {
  if (err) throw err;
  console.log('Gateway corriendo en http://localhost:4000');
});
