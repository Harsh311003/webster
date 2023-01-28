const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET,SENDGRID_API } = require("../keys");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')


// const {SENDGRID_API,EMAIL} = require('../config/keys')

// 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

// router.get("/", (req, res) => {
//   res.send("hello");
// });

// router.get("/protected", requireLogin, (req, res) => {
//   res.send("hello world");
// });


// const transporter = nodemailer.createTransport(sendgridTransport({
//   auth:{
//       api_key:"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"
//   }
// }))


router.post("/signup", (req, res) => {
  // console.log(req.body.name);
  const { name, email, password,pic } = req.body;
  if (!email || !password || !name) {
    // res.json({error:"please add all the fields"})     /// status code  200 is for ok when  all thing are smooth or it set to by default but for getting error we have status code 422
    return res.status(422).json({ error: "please add all the fields" }); // return for not going  further process if we are getting errror
  }
  // res.json({message:"succesfully posted"})

  User.findOne({ email, email })
    .then((savedUser) => {
      //{email,email} ---{key,value} for checking in our database
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists with that email" });
      }

      // bcrypt.hash(which field we want to hash,number - more big number will be  more secure the password will be )  * syntax of bcrypt**
      bcrypt.hash(password, 12).then((hashpassword) => {
        const user = new User({
          email, // if key:value same then we simply write only key like here
          password: hashpassword,
          name: name,
          pic
        });
        user
          .save()
          .then((user) => {
            //  transporter.sendMail({
            //         to:user.email,
            //         from:"harshsharma311003@gmail.com",
            //         subject:"signup success",
            //         html:"<h1>welcome to instagram</h1>"
            //     }).then(console.log("email sent"))
            //     .catch((err) => {
            //       console.log(err);
            //     });
           
            res.json({ message: "saved successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser)
      return res.status(422).json({ error: "Invalid Email or Password" });
    bcrypt.compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({message:"successfully signed in"})        // using token user can access the protective resource

          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET); //saving user id to _id
          // const {_id,name,email}=savedUser
          // res.json({ token: token ,user:{_id,name,email}});             // now we update this as below because now we have to send follow and following array with user data when once he logged in it is used in getsubpost
          const {_id,name,email,followers,following,pic} = savedUser
          res.json({token,user:{_id,name,email,followers,following,pic}})
          ///we use sign method to generate token
        } else {
          return res.status(422).json({ error: "Invalid Email or Password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
