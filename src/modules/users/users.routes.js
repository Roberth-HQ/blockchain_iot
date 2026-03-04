import {
  createAdmin,
  getAdmins,
  deleteAdmin,
  updateAdmin
 } from './users.controller.js'

export default async function authRoutes(fastify, options) {


  fastify.post('/create-admin',{
    preHandler:[
      fastify.authenticate,
      fastify.authorize('SUPER_ADMIN')
    ]
  }, createAdmin)

  fastify.get('/admins',{
    preHandler: [
      fastify.authenticate,
      fastify.authorize('SUPER_ADMIN')
    ]
  },getAdmins)

    fastify.delete('/admins/:id', {
    preHandler: [
      fastify.authenticate,
      fastify.authorize('SUPER_ADMIN')
    ]
  }, deleteAdmin)

  fastify.put('/admins/:id', {
    preHandler: [
      fastify.authenticate,
      fastify.authorize('SUPER_ADMIN')
    ]
  }, updateAdmin)



}

