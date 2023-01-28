const express = require("express");
const app = express();
const Port = 5000;
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
const nodemailer = require('nodemailer')
const sendgrid=require("@sendgrid/mail");



  // sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

  // const content = {
  //   to: "harshkumar311003@gmail.com", // carga logistica email
  //   from: "harshsharma311003@gmail.com",
  //   subject: "`${name} requiere de un servicio.`",
  //   html:"<h1>welcome to instagram</h1>"

  // };


  //   sendgrid.send(content);
   



mongoose
.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(console.log("connected")); // connecting server to mongodb atls

mongoose.connection.on("connected", () => {
  console.log("connected to mongo yeahh");
});
mongoose.connection.on("error", (err) => {
  // receive the error- (err)
  console.log("err connecting ", err);
});


require("./models/user");
require("./models/post");   // register post model 
app.use(express.json()); // using  as middleware  ---- to pass all incoming request in json format  
app.use(require("./routes/auth"));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

 
app.listen(Port, () => {
  console.log("server is running  on port ", Port);
});








///                                       middleware

// const customMiddleware = (req, res, next) => {     // this function is middleware
//     console.log("middleware executed!");
//     next();                     // if we do not write next() than it dont call next route
// };

// // app.use(customMiddleware);      // middleware work for all route

// app.get("/", (req, res) =>
//  {
//     console.log("home");
//   res.send("Hello world");
// });

// app.get("/login",customMiddleware, (req, res) =>
//  {
//     console.log("login");
//   res.send("hello user");
// });