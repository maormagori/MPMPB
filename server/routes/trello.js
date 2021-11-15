const router = require("express").Router();
const trello = require("../services/trello");

router.post("/update/:id", (req, res) => {
    trello.cardsTrigger(req.body);
});

module.exports = router;
