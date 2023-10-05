import prisma from "database";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

export async function createRandomUser(adult?: boolean){
    const birthDate = adult ? dayjs("2000-10-10").toDate() : faker.date.birthdate();
    const user = await prisma.user.create({
        data: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            cpf: faker.string.numeric(11),
            birthDate
        }
    })
    return user;
}