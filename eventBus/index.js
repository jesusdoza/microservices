const express = require("express");
const bodyparser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 4005;

app.use(bodyparser.json());

app.post("/events", async (req, res) => {
    const event = req.body;
    try {
        await axios.post("http://localhost:4000/events", event);
    } catch (error) {
        console.log("eventbus error at 4000 service");
    }
    try {
        await axios.post("http://localhost:4001/events", event);
    } catch (error) {
        console.log("eventbus error at 4001 service");
    }

    try {
        await axios.post("http://localhost:4002/events", event);
    } catch (error) {
        console.log("eventbus error at 4002 service");
    }

    res.status(200).json({ status: "OK" });
});

app.listen(PORT, () => {
    console.log("event bus running at port Listening at: ", PORT);
});
