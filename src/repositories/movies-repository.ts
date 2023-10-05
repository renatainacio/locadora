import prisma from "../database"

export async function getById(id: number) {
  return prisma.movie.findUnique({
    where: { id }
  })
}

export default {
  getById
}