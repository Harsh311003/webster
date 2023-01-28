const { request } = require("express");
const express = require("express"); 
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin=require("../middleware/requireLogin");
const Post=mongoose.model("Post");



//for all posts 
router.get("/allpost",requireLogin,(req,res)=>{
    Post.find()  //finding all posts without any condition
    .populate("postedBy","_id name")  //   here populate is for publish or show the some fields populate("postedBy","_id name")--populate("which element we want to show by acc to us","which property we want to show") ,it will expand only _id and name
    .populate("comments.postedBy","_id name")   // this is for populate to show the id and name of the person who poste the comment on someone post and above populate is for user who posted the post or having that post
    .then(posts=>{
        res.json({posts:posts})    // here one posts is like array which store posts value
    })
    .catch(err=>{
        console.log(err)
    })
})
  
router.get('/getsubpost',requireLogin,(req,res)=>{         // getsubpost -->> getting all post of all the person whose followed by me

    // if postedBy in following
    Post.find({postedBy:{$in:req.user.following}})           // {postedBy:{$in:req.user.following}}-->>> here we quering one by one  posetdBy of each post ( of Post db ) in following array of user if it is present  then we will return 
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

//Create new post 
router.post("/createpost",requireLogin,(req,res)=>{
    const {title,body,pic}=req.body;
    if(!title || !body || !pic)
    {
        return res.status(422).json({error :"Please add all the fields"});
    }
      req.user.password=undefined  //password will not show with post
      req.user.id=undefined
    const post=new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    });
   
});


// check of my uploaded post
router.get("/mypost",requireLogin,(req,res)=>{  //"requireLogin" for acess req.user._id
    Post.find({postedBy: req.user._id})  
    .populate("postedBy","_id name")  //it will expand only _id and name
    .then(mypost=>{
        res.json({mypost:mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.put("/like",requireLogin,(req,res)=>{     // we use put bcoz we want only insert data in likes array      put-->> means we have only update request
    Post.findByIdAndUpdate(req.body.postId,{            /// req.body.postId, we get this by frontned
        $push:{likes:req.user._id}                 /// push->> we push the id of the user who logged in and like the post
    },{
        new:true                                   // keep it true bcoz we want new updated record from mongodb
    })
    .populate("comments.postedBy","_id name")        
    .populate("postedBy","_id name")               // i add aditionaly two line for showing name of the user whose posted the post
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}                         //this pull remove the user from the likes array
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put("/comment",requireLogin,(req,res)=>{
    const comment = {
        text : req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{       // :postId -->> here we send this ("postId " of post ,which user want to delete) along with url /deletepost
    Post.findOne({_id:req.params.postId})                         // now serching in database
    .populate("postedBy","_id")
    .exec((err,post)=>{                                                //after execution we get err or that post (can be null if   not exist in db)
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){             // req.user._id this is object id or having type - object ,so we convert in the string form to do compare
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})



module.exports=router;