const { admin, db } = require("./admin");

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken) //return the user data
    .then((decodedToken) => {
      req.user = decodedToken;
      console.log(req.user);
      return db
        .collection("users")
        .where("userId", "==", req.user.user_id)
        .limit(1)
        .get();
    })
    .then((data) => {
      console.log(data.docs);
      req.user.handle = data.docs[0].data().handle;
      // req.user.imageUrl = data.docs[0].data().imageUrl;
      return next();
    })
    .catch((err) => {
      console.error("Error while verifying token ", err);
      return res.status(403).json(err + "403");
    });
};
