import { createRandomMovie } from "../factories/movie-factory";
import { createRental } from "../factories/rental-factory";
import { createRandomUser } from "../factories/user-factory";
import { cleanDb } from "../utils"
import supertest from "supertest";
import app from "app";
import prisma from "database";

beforeEach(async () => {
  await cleanDb();
});

const api = supertest(app);

describe("Rentals Service Integration Tests", () => {
  describe("get /rentals tests", () => {
    it("should return all rentals with a 200 status", async () => {
      const userOne = await createRandomUser();
      const userTwo = await createRandomUser();
      const movieOne = await createRandomMovie(false);
      const movieTwo = await createRandomMovie(false);
      const movieThree = await createRandomMovie(false);
      await createRental(userOne.id, [movieOne.id, movieTwo.id]);
      await createRental(userTwo.id, [movieThree.id]);
      const { status, body } = await api.get("/rentals");
      expect(body).toHaveLength(2);
      expect(body).toEqual(expect.arrayContaining([
        expect.objectContaining({
            id: expect.any(Number),
            date: expect.any(String),
            endDate: expect.any(String),
            userId: userOne.id,
            closed: false
          })
        ]));
      expect(status).toBe(200);
    })
  
    it("should return no rentals with a 200 status", async () => {
      const { status, body } = await api.get("/rentals");
      expect(body).toHaveLength(0);
      expect(body).toEqual([]);
      expect(status).toBe(200);
    })
  })

  describe("get /rentals/:id tests", () => {
    it("should return a specific rental with a 200 status", async () => {
      const userOne = await createRandomUser();
      const movieOne = await createRandomMovie(false);
      const movieTwo = await createRandomMovie(false);
      const rental = await createRental(userOne.id, [movieOne.id, movieTwo.id]);
      const { status, body } = await api.get(`/rentals/${rental.id}`);
      expect(body).toEqual(
        expect.objectContaining({
            id: expect.any(Number),
            date: expect.any(String),
            endDate: expect.any(String),
            userId: userOne.id,
            closed: false
          }));
      expect(status).toBe(200);
    })
  
    it("should return 404 if rental doesnt exist", async () => {
      const { status} = await api.get("/rentals/1");
      expect(status).toBe(404);
    })
  })

  describe("post /rentals tests", () => {
    it("should return 201 when body is valid", async () => {
      const userOne = await createRandomUser();
      const movieOne = await createRandomMovie(false);
      const movieTwo = await createRandomMovie(false);
      const { status } = await api.post(`/rentals`).send({
        userId: userOne.id,
        moviesId: [movieOne.id, movieTwo.id]
      });
      expect(status).toBe(201);
      const rentals = await prisma.rental.findMany();
      expect(rentals).toHaveLength(1);
      expect(rentals).toEqual([
          {
            id: expect.any(Number),
            date: expect.any(Date),
            endDate: expect.any(Date),
            userId: userOne.id,
            closed: false
          }]);
    })

    it("should return 422 when body is invalid", async () => {
      const { status } = await api.post(`/rentals`).send({});
      expect(status).toBe(422);
    })
  })

  describe("post /rentals/finish tests", () => {
    it("should return 200 when body is valid", async () => {
      const userOne = await createRandomUser();
      const movieOne = await createRandomMovie(false);
      const movieTwo = await createRandomMovie(false);
      const rental = await createRental(userOne.id, [movieOne.id, movieTwo.id]);
      const { status, body } = await api.post(`/rentals/finish`).send({
        rentalId: rental.id
      });
      expect(status).toBe(200);
      const rentals = await prisma.rental.findMany();
      expect(rentals).toEqual([
          {
            id: expect.any(Number),
            date: expect.any(Date),
            endDate: expect.any(Date),
            userId: userOne.id,
            closed: true
          }]);
    })

  })
})