const { JWT_SECRET } = require("../keys");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers; //Bearer lkdfjkljffls  (authorization will look like)

  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in " });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {            // compare b/w token which are present already and the token made by conversion {token, JWT_SECRET,} this line
    if (err) {                                                    // after verify if there is error then return 
      return res.status(401).json({ error: "You must be logged in " });
    }
    const { _id } = payload;                                             // if there is now error means token is find and verifed then we assign payload which contain id of token which we provide at the time of creating token 
    User.findById(_id).then((userdata) => {
      req.user = userdata;                 ///***below */
      next();
    });
  });
};







//// req.user
1


// req.user is nothing but a custom key of req object. Which can be inserted from any route by pointing req object.But generally, it is inserted from the authorization middleware where we compare user by the token. (JWT).
//So req.user can be accessible in all the root where authorization middleware is called.

// Note: You can put any data in it and also with a different key like req.body.yourKey