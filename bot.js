const { hostname, port } = require("./config/config");
const express = require("express");
const syncer = require("./server/routes/syncer.js");

const app = express();

app.use("/syncer", syncer);

app.listen(port, hostname, () => {
    console.log(`MPMPB listening on port ${port}!`);
});
