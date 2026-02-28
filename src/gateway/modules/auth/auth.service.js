import prisma from '../../../../prisma/client.js'
import bcrypt from 'bcrypt'

export async function loginService(email, password) {

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new Error('Credenciales inválidas')
  }

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) {
    throw new Error('Credenciales inválidas')
  }

  return user
}

