const router = require("express").Router();
const trello = require("../services/trello");

router.post("/:trelloBoard/:githubRepo", (req, res) => {
    trello.cardsTrigger(req.body, req.params.githubRepo).then(send());
});

module.exports = router;
