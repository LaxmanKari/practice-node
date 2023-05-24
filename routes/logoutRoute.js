const express = require('express'); 
const app = express();
const router = express.Router(); 
const session = require('express-session'); 

//express midleware module for session data management
app.use(session({
   secret: "Eee sala cup namde", 
   resave: true, 
   saveUninitialized: false
}))

router.get("/", (req, res, next) => {
   //if session exists, destroy it 
   if(req.session){
      req.session.destroy(() => {
         res.redirect("/login");
      })
   }
}) 

module.exports = router; 