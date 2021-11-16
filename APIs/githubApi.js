const { Octokit } = require("@octokit/rest");
const { auth } = require("../config/config");

const githubApi = new Octokit({
    auth: auth.github.token,
    userAgent: "MPMPB",
});

const createAnIssueFromTrelloCard = async (card, repo) => {
    let githubRes = await githubApi.rest.issues.create({
        repo: repo,
        owner: auth.github.user,
        title: card.title,
        body: card.description,
    });

    return githubRes;
};

const updateAnIssueFromTrelloCard = async (card, repo, issue_number) => {
    let githubRes = await githubApi.rest.issues.update({
        owner: auth.github.user,
        repo: repo,
        issue_number: issue_number,
        title: card.title,
        body: card.description,
        state: card.state,
    });

    return githubRes;
};

const getIssue = async (issue_number, repo) => {
    return await githubApi.rest.issues.get({
        owner: auth.github.user,
        repo: repo,
        issue_number: issue_number,
    });
};

module.exports = {
    createAnIssueFromTrelloCard,
    updateAnIssueFromTrelloCard,
    getIssue,
};
