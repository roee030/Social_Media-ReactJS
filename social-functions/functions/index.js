const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const express = require("express");
const app = express();
const firebaseConfig = {
  apiKey: "AIzaSyBqzYuCxoU0-3_i6qfhxS1sS4GgdTZUnrI",
  authDomain: "socialape-dda8e.firebaseapp.com",
  databaseURL: "https://socialape-dda8e.firebaseio.com",
  projectId: "socialape-dda8e",
  storageBucket: "socialape-dda8e.appspot.com",
  messagingSenderId: "993373409509",
  appId: "1:993373409509:web:235c8b475577018146440c",
  measurementId: "G-EM1JPX95F9",
};
const firebase = require("firebase");
// Initialize Firebase for Auth
firebase.initializeApp(firebaseConfig);
const db = admin.firestore();
app.get("/screams", (req, res) => {
  db.collection("screams")
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
  db.collection("screams")
    .add(newScream)
    .then((data) => {
      res.json({ message: `document ${data.id} created successfully` });
    })
    .catch((e) => {
      res.json({ message: `something went wrong when try to add new scream` });
      console.log(e);
    });
});
//create new user using firebase
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  //   const { valid, errors } = validateSignupData(newUser);

  //   if (!valid) return res.status(400).json(errors);

  const noImg = "no-img.png";

  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    }) //user created and we have access to uesr id
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    // .then((idToken) => {
    //   token = idToken;
    //   const userCredentials = {
    //     handle: newUser.handle,
    //     email: newUser.email,
    //     createdAt: new Date().toISOString(),
    //     //TODO Append token to imageUrl. Work around just add token from image in storage.
    //     imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
    //     userId,
    //   };
    //   return db.doc(`/users/${newUser.handle}`).set(userCredentials);

    // })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        //TODO Append token to imageUrl. Work around just add token from image in storage.
        // imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        // userId,
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
      //   return res.status(201).json({ token });
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already is use" });
      } else {
        return res
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
});
app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  let errors = {};

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json({ error: e.code });
    });
});
exports.api = functions.https.onRequest(app);
