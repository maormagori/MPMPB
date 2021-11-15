const request = require("supertest");
const cardAddedBody = require("../examples/trello/cardCreated.json");
const app = require("../server/routes/syncer");
describe("syncer endpoints", () => {
    it("Trigger response to card being added to Trello", async () => {
        const res = await request(app)
            .post(`/trello/update/${cardAddedBody.action.id}`)
            .send(cardAddedBody);
        expect(res.statusCode).toEqual(200);
    });
});
