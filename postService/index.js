const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const { log } = require("console");

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));

// const EVENTS_BUS_IP = "http://localhost:4005/events";
const EVENTS_BUS_IP = "http://event-bus-srv:4005";
const PORT = 4000;

const posts = {}; //DATABASE HOLDING ALL POSTS in memory

app.get("/posts", (req, res) => {
    res.send(posts);
});
app.get("/", (req, res) => {
    console.log("get all posts");
    res.send(posts);
});

//create new post and send event to eventbus
app.post("/posts", async (req, res) => {
    console.log("new post recieved");
    const { title } = req.body;
    const id = randomBytes(4).toString("hex");

    posts[id] = {
        id,
        title,
    };

    try {
        //send event to event bus
        await axios.post(`${EVENTS_BUS_IP}/events`, {
            type: "PostCreated",
            data: {
                id,
                title,
            },
        });
    } catch (error) {
        console.log("error sending to events bus from posts service");
        // console.log("error", error);
        res.status(401);
    }

    res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
    console.log("Received Event", req.body.type);

    res.send({});
});

app.listen(PORT, () => {
    console.log("posts");
    console.log(`Listening on ${PORT} with /posts`);
});
