import prisma from "../database"

export async function getById(id: number) {
  return await prisma.user.findUnique({
    where: { id }
  })
}


export default {
  getById
}