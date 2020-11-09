const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

exports.getScreams = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection("screams")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((element) => {
        screams.push(element.data());
      });
      return res.json(screams);
    })
    .catch((e) => console.log(e));
});
exports.createScream = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    res.json({
      message: `You trying to add Scream, HTTP Method are not allowed you need to use POST request`,
    });
  }
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    creatAt: admin.firestore.Timestamp.fromDate(new Date()),
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
