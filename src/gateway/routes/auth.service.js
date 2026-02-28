import prisma from '../../../prisma/client.js'
import bcrypt from 'bcrypt'

export async function createAdminService(email, password) {
    const existing = await prisma.user.findUnique({
        where: {email}
    })
    if (existing){
        throw new Error('El usuasio ya existe')
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await prisma.user.create({
        data:{
            email,
            password: hashedPassword,
            role: 'ADMIN'
        }
    })
    return{
        id: admin.id,
        email:admin.email,
        role: admin.role
    }
}

export async function deleteAdminService(id) {
    const existing = await prisma.user.findUnique({
        where: {id: Number (id)}
    })
    if (!existing){
        throw new Error ('EL usuario administrador no existe')
    }
    return prisma.user.delete({
        where: {id:Number(id)}
    })
}

export async function updateAdminService(id, email) {
    return prisma.user.update({
        where: {id: Number(id)},
        data:{email}
    })
    
}
export async function getAdminService() {
    return prisma.user.findMany({
        where: {role: 'ADMIN'},
        select:{id:true,email:true,role:true}

    })
    
}