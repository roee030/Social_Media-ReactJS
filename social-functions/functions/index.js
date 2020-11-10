const functions = require("firebase-functions");
const express = require("express");
const app = express();
//Import Functions
const FBAuth = require("./util/FBAuth");
const { getAllScreams, postOneScream } = require("./handlers/screams");
const { login, signup, uploadImage } = require("./handlers/users");

// Initialize Firebase for Auth

//Scream Routes
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, postOneScream);

//Users Routes
app.post("/login", login);
app.post("/signup", signup);
app.post("/user/image", uploadImage);

exports.api = functions.https.onRequest(app);
