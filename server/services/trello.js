const config = require("../../config/config").syncer;
const githubApi = require("../../APIs/githubApi");
// ***************
// TRIGGER ACTIONS
// ***************
const cardCreated = async (card, repo) => {
    config.trello.isWorking = true;
    config.trello.latest.card = card.id;
    config.trello.latest.timestamp = Date.now();

    let githubIssue = await githubApi.createAnIssueFromTrelloCard(card, repo);

    console.log(githubIssue);
    config.trello.isWorking = false;
    return card;
};

const cardUpdated = async (card, repo) => {
    config.trello.isWorking = true;
    config.trello.latestCardId = card.id;

    //TODO: get issue number from local db

    let githubIssue = await githubApi.updateAnIssueFromTrelloCard(card, repo);

    config.trello.isWorking = false;
    return card;
};

const ACTIONS_ENUM = {
    createCard: cardCreated,
    updateCard: cardUpdated,
};
// ***************
// END OF TRIGGER ACTIONS
// ***************

const handler = async (action, card, githubRepo) => {
    if (ACTIONS_ENUM[action]) return ACTIONS_ENUM[action](card, githubRepo);
    else console.warn(`No handler for action: ${action}`);
};

const cardsTrigger = async (event, githubRepo) => {
    if (skipCard(event)) {
        console.info(
            `Card ${event.action.data.card.id} with action ${event.action.type} skipped.`
        );
        return;
    }

    let card = eventToCard(event);

    return handler(event.action.type, card, githubRepo);
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
