const express = require('express'); 
const app = express(); 
const router = express.Router(); 
const User = require('../schemas/UserSchema');
const bcrypt = require('bcrypt'); 

app.set("view engine", "pug"); 
app.set("views", "views"); 

//middleware to handle req/res body 
app.use(express.json());
app.use(express.urlencoded({extended: false})); 

router.get("/", (req, res, next) => {
   res.status(200).render("register");
})

router.post("/", async (req,res,next) => {
   var firstName = req.body.firstName.trim(); 
   var lastName = req.body.lastName.trim();
   var userName = req.body.userName.trim();
   var email = req.body.email.trim();
   var password = req.body.password;

   var payload = req.body;

   if(firstName && lastName && userName && email && password){

      var user = await User.findOne({
         $or : [
            {email : email},
            {userName: userName}
         ]
      })
      .catch((error) => {
         console.log(error);
         payload.errorMessage= "Something went wrong"; 
         res.status(200).render("register", payload)
      }) 
      
      if(user == null){
 
         var data = req.body; 
         data.password = await bcrypt.hash(password, 10)// 2^10 crypts
         User.create(data)
         .then( (user) => {
            req.session.user = user; 
            return res.redirect("/")
         })
      }
      else {
         if(email == user.email){
            payload.errorMessage = "Email is already in use";    
         }
         else{
            payload.errorMessage = "user name is already in use"; 
         }
         return res.status(200).render("register",payload);
      }
      
   }
   else {
      payload.errorMessage = "Verify all fields are entered and valid"; 
      res.status(200).render("register",payload); 
   }
})

module.exports = router; 


