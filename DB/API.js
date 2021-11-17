const sqlite3 = require("better-sqlite3");
const db = new sqlite3("syncer.db", { verbose: console.log });

const insertNewCardIssuePair = (project, cardId, issueNumber) => {
    _createSyncerTableIfNotExists(project);

    let result = false;
    try {
        const info = db
            .prepare(
                `INSERT INTO ${project} (card_id, issue_number) VALUES (?, ?)`
            )
            .run(cardId, issueNumber);
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
        .prepare(`SELECT issue_number FROM ${project} WHERE card_id = ?`)
        .get(cardId);

    return issueNumber;
};

const getCardIdFromIssueNumber = (project, issueNumber) => {
    const cardId = db
        .prepare(`SELECT card_id FROM ${project} WHERE issue_number = ?`)
        .get(issueNumber);

    return cardId;
};

const _createSyncerTableIfNotExists = (tableName) => {
    db.prepare(
        `CREATE TABLE IF NOT EXISTS ${tableName} (card_id TEXT NOT NULL UNIQUE, issue_number INTEGER NOT NULL)`
    ).run();
};

module.exports = {
    insertNewCardIssuePair,
    getCardIdFromIssueNumber,
    getIssueNumberFromCardId,
};
