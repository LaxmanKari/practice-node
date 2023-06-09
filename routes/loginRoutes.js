const express = require('express'); 
const app = express(); 
const router = express.Router(); 
const bcrypt = require('bcrypt'); 
const User = require('../schemas/UserSchema'); 

app.set("view engine", "pug"); 
app.set("views", "views"); 

//middleware to handle req/res body 
app.use(express.json());
app.use(express.urlencoded({extended: false}));

router.get("/", (req, res, next) => {
   res.status(200).render("login"); 
}) 

router.post("/", async (req, res, next) => {
   var payload = req.body; 
   //entered field values
   
   if(req.body.logUsername && req.body.logPassword){

      var user = await User.findOne({
         $or : [
            {userName : req.body.logUsername},
            {email : req.body.logUsername}
         ]
      })
      .catch((error) => {
         console.log(error); 
         payload.errorMessage = "Something went wrong";
         res.status(200).render("login", payload);
      })

      if(user != null){
         var result = await bcrypt.compare(req.body.logPassword, user.password); 

         if(result === true){
            req.session.user = user; 
            return res.redirect("/"); 
         }
      }

      //user doesn't exist 
      payload.errorMessage = "Incorrect Login Credentials";
      return res.status(400).render("login", payload); 
   } 

   payload.errorMessage = "Make sure each field has a valid value"; 
   res.status(200).render("login", payload); 
})



module.exports = router; 