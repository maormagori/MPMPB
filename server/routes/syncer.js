const express = require("express");
const github = require("./github");
const trello = require("./trello");
const syncer = express.Router();

syncer.use("/github", github);

syncer.use("/trello", trello);

module.exports = syncer;
