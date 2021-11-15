const trello = require("../server/services/trello");
const cardCreatedBody = require("../examples/trello/cardCreated.json");

describe("Testing the trello card trigger handler.", () => {
    it("creating a new card event", async () => {
        let returnedCard = await trello.cardsTrigger(cardCreatedBody);
        expect(returnedCard).toEqual({
            id: "6191091bdfde725391ee27bf",
            title: "added",
            description: "",
            state: "open",
        });
    });
});
