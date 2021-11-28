const router = require("express").Router();
const trello = require("../services/trello");

router.post("/:project/:githubRepo", async (req, res) => {
    try {
        await trello.cardsTrigger(
            req.body,
            req.params.project,
            req.params.githubRepo
        );
        res.send();
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;
