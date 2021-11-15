const config = require("../../config/config").syncer;

class cardHandler {
    actionsEnum = {
        createCard: this.cardCreated,
        updateCard: this.cardUpdated,
    };

    async cardCreated(card) {
        config.trello.isWorking = true;
        config.trello.latest.card = card.id;
        config.trello.latest.timestamp = Date.now();

        //await githubApi.createIssue(card);

        config.trello.isWorking = false;
        return card;
    }

    async cardUpdated(card) {
        config.trello.isWorking = true;
        config.trello.latestCardId = card.id;

        //await githubApi.updateIssue(card);

        config.trello.isWorking = false;
        return card;
    }

    async handler(action, card) {
        if (this.actionsEnum[action]) return this.actionsEnum[action](card);
        else console.warn(`No handler for action: ${action}`);
    }
}

const testingBoard = new cardHandler();

const cardsTrigger = async (event) => {
    if (skipCard(event)) {
        console.info(
            `Card ${event.action.data.card.id} with action ${event.action.type} skipped.`
        );
        return;
    }

    let card = eventToCard(event);

    return testingBoard.handler(event.action.type, card);
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
