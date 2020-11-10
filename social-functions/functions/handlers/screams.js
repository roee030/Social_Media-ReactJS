const { db } = require("../util/admin");
exports.getAllScreams = (req, res) => {
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
};

exports.postOneScream = (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
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
};
//create new user using firebase
