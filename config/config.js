require("dotenv").config();

let config = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || "5588",
    hostname: process.env.HOSTNAME || "127.0.0.1",

    syncer: {
        trello: {
            isWorking: false,
            latest: {
                card: "",
                timestamp: null,
            },
        },

        github: {
            isWorking: false,
            latest: {
                issue: "",
                timestamp: null,
            },
        },
    },
};

module.exports = config;
