const express = require('express'); 
const app = express();
const port = 3003;  
const middleware = require('./middleware')
const bodyParser = require('body-parser'); 
const path = require('path'); 
const mongoose = require('./database'); 

//view engine and views path
app.set("view engine", "pug"); 
app.set("views", "views"); 

//body-parser 
app.use(bodyParser.urlencoded({extended: false}))

//path to access static files 
app.use(express.static(path.join(__dirname, "public"))); 

//Routes 
const loginRoute = require('./routes/loginRoutes'); 
const registerRoute = require('./routes/registerRoutes'); 


app.use("/login", loginRoute); 
app.use("/register", registerRoute); 

const server = app.listen(port, (req,res,next) => {
   console.log("Server listening on " + port); 
}) 

app.get("/", middleware.requireLogin, (req,res,next) => {

   var payload = {
      pageTitle: "Home"
   }
   res.status(200).render("home", payload); 
})