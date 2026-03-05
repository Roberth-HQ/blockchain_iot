 
import prisma from '../../../prisma/client.js'

 export async function createLocationService({name, addres, projectId}) {
    return prisma.location.create({
        data:{
            name,
            addres: addres || null,
            projectId
        }
    })
 }

 export async function getAllLocationsService() {
    return prisma.location.findMany()
 }

 export async function getLocationByIdService(id) {
    return prisma.location.findUnique({
        where: {id}
    })
 }

 export async function updateLocationService(id, data) {
    return prisma.location.update({
        where:{id},
        data
    })
 }

 export async function deleteLocationService(id) {
    return prisma.location.delete({
        where: {id},
    })
    
 }