import{
    createAdminService,
    getAdminService,
    deleteAdminService,
    updateAdminService,
}from './users.service.js'

export async function createAdmin(request, reply) {
  try {
    const { email, password } = request.body

    const admin = await createAdminService(email, password)

    return reply.send({
      message: 'Admin creado correctamente',
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      }
    })

  } catch (error) {
    return reply.status(400).send({ error: error.message })
  }
}

export async function getAdmins(request, reply) {
  const admins = await getAdminService()
  return reply.send(admins)
}

export async function deleteAdmin(request, reply) {
  const { id } = request.params
  await deleteAdminService(id)
  return reply.send({ message: 'Admin eliminado' })
}

export async function updateAdmin(request, reply) {
  const { id } = request.params
  const { email } = request.body

  const updated = await updateAdminService(id, email)

  return reply.send({
    message: 'Admin actualizado',
    admin: updated
  })
}