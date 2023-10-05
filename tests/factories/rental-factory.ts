import prisma from "database";
import dayjs from "dayjs";

export async function createRental(userId: number, moviesIds: number[], closed?: boolean){
    const date = dayjs();
    const rental = await prisma.rental.create({
        data: {
            date: date.toDate(),
            endDate: date.add(2, 'day').toDate(),
            userId,
            closed: closed || false
        }
    });
    moviesIds.forEach(movieId => {
        prisma.movie.update({
            data: {
                rentalId: rental.id
            },
            where: {
                id: movieId
            }
        })
    })

    return rental;
}