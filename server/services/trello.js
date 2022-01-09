const config = require("../../config/config").syncer;
const githubApi = require("../../APIs/githubApi");
const db = require("../../DB/API");

const workLog = {
    start: (cardId) => {
        console.log(
            `[${new Date().toLocaleTimeString()}] Trello service: Started working on card ${cardId}`
        );
        config.trello.isWorking = true;
        config.trello.latest.card = cardId;
        config.trello.latest.timestamp = Date.now();
    },
    stop: () => {
        config.trello.isWorking = false;
        console.log(
            `[${new Date().toLocaleTimeString()}] Trello service: Stopped working on card ${
                config.trello.latest.card
            }`
        );
    },
};
// ***************
// TRIGGER ACTIONS
// ***************
const cardCreated = async (card, repo, project) => {
    let githubIssue = await githubApi.createAnIssueFromTrelloCard(card, repo);

    db.insertNewCardIssuePair(project, card.id, githubIssue.data.number);

    return true;
};

const cardUpdated = async (card, repo, project) => {
    try {
        const { issue_number } = db.getIssueNumberFromCardId(project, card.id);
        await githubApi.updateAnIssueFromTrelloCard(card, repo, issue_number);
        return true;
    } catch (error) {
        if (true) {
            //TODO: check it's the right error.
            cardCreated(card, repo, project);
            return true;
        } else return false;
    }
};

const ACTIONS_ENUM = {
    createCard: cardCreated,
    updateCard: cardUpdated,
};
// ***************
// END OF TRIGGER ACTIONS
// ***************

const handler = async (action) => {
    if (ACTIONS_ENUM[action]) {
        let argumentsToPass = arguments;
        argumentsToPass.shift();
        return ACTIONS_ENUM[action](...argumentsToPass);
    } else {
        console.warn(`No handler for action: ${action}`);
    }
};

const cardsTrigger = async (event, githubRepo, project) => {
    if (skipCard(event)) {
        console.info(
            `Card ${event.action.data.card.id} with action ${event.action.type} skipped.`
        );
        return;
    }

    let card = eventToCard(event);

    workLog.start(card.id);
    let syncingResult = await handler(
        event.action.type,
        card,
        githubRepo,
        project
    );
    workLog.stop();

    return syncingResult;
};

const eventToCard = (event) => {
    let assumedState = "open";
    if (event.action.data.list)
        assumedState =
            event.action.data.list.name.toLowerCase() === "completed"
                ? "closed"
                : "open";
    else if (event.action.data.listAfter)
        assumedState =
            event.action.data.listAfter.name.toLowerCase() === "completed"
                ? "closed"
                : "open";

    let card = {
        id: event.action.data.card.id,
        title: event.action.data.card.name,
        description: event.action.data.card.desc || "",
        state: assumedState,
    };

    return card;
};

const skipCard = (event) => {
    //TODO: add filtering
    return false;
};

module.exports = { cardsTrigger };
