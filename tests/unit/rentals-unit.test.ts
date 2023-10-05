import { faker } from "@faker-js/faker";
import * as rentalRepo from "../../src/repositories/rentals-repository";
import * as movieRepo from "../../src/repositories/movies-repository";
import * as userRepo from "../../src/repositories/users-repository";
import rentalService from "../../src/services/rentals-service"
import dayjs from "dayjs";

describe("Rentals Service Unit Tests", () => {

    beforeEach(() => {
      jest.clearAllMocks();
    });

      it("shouldn't let underage rent adult movie", async () => {
  
        jest
        .spyOn(movieRepo.default, "getById")
        .mockImplementationOnce((): any => {
          return {
            name: faker.music.songName(),
            adultsOnly: true,
            rentalId: null
          }
        })
  
        jest
          .spyOn(userRepo.default, "getById")
          .mockImplementationOnce((): any => { 
            return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            cpf: faker.string.numeric(11),
            birthDate: dayjs('2010-08-08').toDate()
          }
        });
  
        jest
          .spyOn(rentalRepo.default, "getRentalsByUserId")
          .mockImplementationOnce(():any => {return []});
  
        const rental = {
          userId: faker.number.int(),
          moviesId: [faker.number.int()]
        }
  
        const promise = rentalService.createRental(rental)
        expect(promise).rejects.toEqual({
          name: "InsufficientAgeError",
          message: "Cannot see that movie."
        });
      })

      it("shouldn't let customer rent movie if a rental is opened", async () => {
    
        jest
          .spyOn(userRepo.default, "getById")
          .mockImplementationOnce((): any => { 
            return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            cpf: faker.string.numeric(11),
            birthDate: dayjs("1999-10-10").toDate()
          }
          });
      
        jest
          .spyOn(rentalRepo.default, "getRentalsByUserId")
          .mockImplementationOnce(():any => {
            return [{
            userId: 1,
            movieId: 1,
            closed: false
          }]
        });
  
        const rental = {
          userId: faker.number.int(),
          moviesId: [faker.number.int()]
        }
        const promise = rentalService.createRental(rental)
        expect(promise).rejects.toEqual({
          name: "PendentRentalError",
          message: "The user already have a rental!"
        });
      })

      it("shouldn't let customer rent if the movie does not exist", async () => {
  
        jest
        .spyOn(movieRepo.default, "getById")
        .mockImplementationOnce((): any => {return undefined})
    
        jest
          .spyOn(userRepo.default, "getById")
          .mockImplementationOnce((): any => { 
            return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            cpf: faker.string.numeric(11),
            birthDate: dayjs("2006-10-10").toDate()
          }
          });
      
        jest
          .spyOn(rentalRepo.default, "getRentalsByUserId")
          .mockImplementationOnce(():any => {
            return []
        });
  
        const rental = {
          userId: faker.number.int(),
          moviesId: [faker.number.int()]
        }
        const promise = rentalService.createRental(rental)
        await expect(promise).rejects.toEqual({
          name: "NotFoundError",
          message: "Movie not found."
        });
      })

      it("shouldn't let customer rent if the movie is already rented", async () => {
    
        jest
        .spyOn(movieRepo.default, "getById")
        .mockImplementationOnce((): any => {
          return {
            name: faker.music.songName(),
            adultsOnly: false,
            rentalId: 123
          }
        })
    
        jest
          .spyOn(userRepo.default, "getById")
          .mockImplementationOnce((): any => { 
            return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            cpf: faker.string.numeric(11),
            birthDate: dayjs("2006-10-10").toDate()
          }
          });
      
        jest
          .spyOn(rentalRepo.default, "getRentalsByUserId")
          .mockImplementationOnce(():any => {
            return []
        });
    
        const rental = {
          userId: faker.number.int(),
          moviesId: [faker.number.int()]
        }
        const promise = rentalService.createRental(rental)
        await expect(promise).rejects.toEqual({
          name: "MovieInRentalError",
          message: "Movie already in a rental."
        });
      }) 


      it("should allow the rental", async () => {
    
        jest
        .spyOn(rentalRepo.default, "createRental")
        .mockImplementationOnce((): any => {return "ok"});
    
    
        jest
        .spyOn(movieRepo.default, "getById")
        .mockImplementationOnce((): any => {
          return {
            name: faker.music.songName(),
            adultsOnly: false,
            rentalId: null
          }
        })
    
        jest
          .spyOn(userRepo.default, "getById")
          .mockImplementationOnce((): any => { 
            return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            cpf: faker.string.numeric(11),
            birthDate: dayjs("2006-10-10").toDate()
          }
          });
      
        jest
          .spyOn(rentalRepo.default, "getRentalsByUserId")
          .mockImplementationOnce(():any => {
            return []
        });
    
        const rental = {
          userId: faker.number.int(),
          moviesId: [faker.number.int()]
        }
        const result = await rentalService.createRental(rental)
        expect(result).toBe("ok");
      }) 

      it("should should throw user not found error", async () => {
    
        jest
          .spyOn(userRepo.default, "getById")
          .mockImplementationOnce((): any => {});
    
        const rental = {
          userId: faker.number.int(),
          moviesId: [faker.number.int()]
        }
        const promise = rentalService.createRental(rental)
        await expect(promise).rejects.toEqual({
          name: "NotFoundError",
          message: "User not found."
        });
      }) 

      it("should should throw rental not found error", async () => {
    
        jest
          .spyOn(rentalRepo.default, "getRentalById")
          .mockImplementationOnce(():any => {});
    
        const promise = rentalService.finishRental(faker.number.int())
        await expect(promise).rejects.toEqual({
          name: "NotFoundError",
          message: "Rental not found."
        });
      }) 

  })



