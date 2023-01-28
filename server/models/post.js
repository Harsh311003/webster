const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String, //photo will be in url form
    required: true,
  },
  likes:[{type:ObjectId,ref:"User"}],  // likes is a array which store the id of the users ,who like the post
  comments:[{
    text:String,
    postedBy:{type:ObjectId,ref:"User"}
}],
  postedBy: {
    type: ObjectId,
    ref: "User",      //this refer to user model
  },
});

mongoose.model("Post", postSchema);
