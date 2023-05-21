const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser'); 
const router = express.Router(); 
const User = require('../schemas/UserSchema');

app.set("view engine", "pug"); 
app.set("views", "views"); 

//body-parser 
app.use(bodyParser.urlencoded({extended: false})); 

router.get("/", (req, res, next) => {
   res.status(200).render("register");
})

router.post("/", (req, res, next) => {

   var firstName = req.body.firstName.trim(); 
   var lastName = req.body.lastName.trim();
   var userName = req.body.userName.trim();
   var email = req.body.email.trim();
   var password = req.body.password.trim();

   var payload = req.body; 
   
   if(req.body.firstName && req.body.lastName && req.body.userName && req.body.email && req.body.password){

      //Find a user in the db with the provided details, if not present create a new one. 
      User.findOne({
         $or: [
            {userName: userName},
            {email: email}
         ]
      })
   } 
   else {
      payload.errorMessage = "Make sure all the fields has a valid value"; 
   }

   res.status(200).render("register");
}) 


module.exports = router; 


