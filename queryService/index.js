const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let posts = {}; //local memory

const PORT = 4002;
const SERVICE = "Query";

app.get("/posts", (req, res) => {
    res.send(posts);
});

app.post("/events", (req, res) => {
    console.log(`recieved event at ${SERVICE} service`, req.body);
    const { type, data } = req.body;
    if (type === "PostCreated") {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };
    }
    if (type === "CommentCreated") {
        //  data: { id: commentId, content, postId: req.params.id },
        const { id, content, postId } = data;

        const post = posts[postId];

        post.comments.push({ id, content, postId });
    }
    if (type === "CommentUpdated") {
        const { id, content, postId, status } = data;

        const post = posts[postId];

        const comment = post.comments.find((comment) => {
            return comment.id === id;
        });

        comment.status = status;
        comment.content = content;
    }

    // console.log("posts", posts);
    res.send({});
});

app.listen(PORT, () => {
    console.log(`${SERVICE} service Listening on ${PORT}`);
});
