const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const express = require("express");
const app = express();

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().creatAt,
        });
      });
      return res.json(screams);
    })
    .catch((e) => console.log(e));
});

app.post("/screams", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    creatAt: new Date().toISOString(),
  };
  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then((data) => {
      res.json({ message: `document ${data.id} created successfully` });
    })
    .catch((e) => {
      res.json({ message: `something went wrong when try to add new scream` });
      console.log(e);
    });
});

exports.api = functions.https.onRequest(app);
