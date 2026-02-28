import { PrismaPg } from '@prisma/adapter-pg'
import pkg from '@prisma/client'
const { PrismaClient } = pkg
import bcrypt from 'bcrypt'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'root@system.com'
  const password = '123456'

  const existing = await prisma.user.findUnique({
    where: { email }
  })

  if (existing) {
    console.log('SUPER_ADMIN ya existe')
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'SUPER_ADMIN'
    }
  })

  console.log('SUPER_ADMIN creado correctamente')
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())