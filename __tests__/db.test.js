const db = require("../DB/API");

const PROJECT_NAME = "testproject";
const TRELLO_CARD_ID = "6SR8G85DG";
const GITHUB_ISSUE_NUMBER = 56;

describe("testing db functions", () => {
    it("creating new table", () => {
        expect(
            db.insertNewCardIssuePair(
                PROJECT_NAME,
                TRELLO_CARD_ID,
                GITHUB_ISSUE_NUMBER
            )
        ).toEqual(true);
    });

    it("fetching github issue number", () => {
        expect(
            db.getIssueNumberFromCardId(PROJECT_NAME, TRELLO_CARD_ID)
        ).toEqual({ issue_number: GITHUB_ISSUE_NUMBER });
    });

    it("fetching card id", () => {
        expect(
            db.getCardIdFromIssueNumber(PROJECT_NAME, GITHUB_ISSUE_NUMBER)
        ).toEqual({ card_id: TRELLO_CARD_ID });
    });
});
