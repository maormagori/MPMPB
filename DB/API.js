const sqlite3 = require("better-sqlite3");
const db = new sqlite3("syncer.db", { verbose: console.log });

const insertNewCardIssuePair = (project, cardId, issueNumber) => {
    let result = false;
    try {
        const info = db
            .prepare("INSERT INTO ? (card_id, issue_number) VALUES (?, ?)")
            .run(project, cardId, issueNumber);
        if (info.changes > 0) {
            result = true;
        }
    } catch (error) {
        result = false;
        console.error(
            `Error inserting new card ID and issue number pair to ${project} table`,
            error
        );
    } finally {
        return result;
    }
};

const getIssueNumberFromCardId = (project, cardId) => {
    const issueNumber = db
        .prepare("SELECT issue_number FROM ? WHERE card_id = ?")
        .get(project, cardId);

    return issueNumber;
};

const getCardIdFromIssueNumber = (project, issueNumber) => {
    const cardId = db
        .prepare("SELECT card_id FROM ? WHERE issue_number = ?")
        .get(project, issueNumber);

    return cardId;
};
