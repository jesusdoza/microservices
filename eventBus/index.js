const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

///ALL services IP addresses
const POST_SRV_IP = "http://posts-clusterip-srv:4000";
const COMMENTS_SRV_IP = "http://comments-srv:4001";
const QUERY_SRV_IP = "http://query-srv:4002";
const MODERATION_SRV_IP = "http://moderation-srv:4003";
const events = []; // EVENTS DATABASE

app.post("/events", (req, res) => {
    console.log("event bus recieved event");
    // console.log("req", req);
    const event = req.body;

    events.push(event);

    //event bus sends event to all microservices
    ///Posts microservice
    axios.post(`${POST_SRV_IP}/events`, event).catch((err) => {
        console.log("event bus error sending event to post service");
        console.log(err.message);
    });

    axios.post(`${COMMENTS_SRV_IP}/events`, event).catch((err) => {
        console.log(err.message);
    });
    axios.post(`${QUERY_SRV_IP}/events`, event).catch((err) => {
        console.log(err.message);
    });
    axios.post(`${MODERATION_SRV_IP}/events`, event).catch((err) => {
        console.log(err.message);
    });
    res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
    res.send(events);
});

app.listen(4005, () => {
    console.log("Event bus Listening on 4005");
});
