const express = require('express'); 
const app = express(); 
const router = express.Router(); 

const mongoose = require('mongoose'); 
const User = require('../../schemas/UserSchema')
const Post = require('../../schemas/PostsSchema');


router.get("/", (req, res, next) => {
   
   Post.find()
   .populate("postedBy")
   .sort({"createdAt": -1}) 
   .then(results => res.status(200).send(results)) 
   .catch((error) => {
      console.log(error); 
      res.sendStatus(400);
   }) 
   return; 
})

router.post("/", async (req, res, next) => {

   if(!req.body.content){
      console.log("content param not sent with request"); 
      res.sendStatus(400); 
      return; 
   } 

   var postData = {
      content: req.body.content, 
      postedBy: req.session.user
   }
   console.log(postData); 

   Post.create(postData)
   .then(async (newPost) => {
      newPost = await User.populate(newPost, {path: "postedBy"}) 

      res.status(201).send(newPost);
   }) 
   .catch((error) => {
      console.log(error); 
      res.sendStatus(400); 
   })
})

module.exports = router; 