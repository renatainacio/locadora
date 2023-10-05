import { faker } from "@faker-js/faker";
import prisma from "database";

export async function createRandomMovie(adult?: boolean){
    const movie = await prisma.movie.create({
        data: {
            name: faker.music.songName(),
            adultsOnly: adult || faker.datatype.boolean()
        }
    });
    return movie;
}