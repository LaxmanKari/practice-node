const express = require('express'); 
const app = express();
const port = 3003;  
const middleware = require('./middleware')
const path = require('path'); 
const mongoose = require('./database'); 
const session = require('express-session'); 
const morgan = require('morgan');

//view engine and views path
app.set("view engine", "pug"); 
app.set("views", "views"); 

//middleware to handle req/res body 
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//path to access static files 
app.use(express.static(path.join(__dirname, "public"))); 

//logging using morgan module
// const logFormat = ':method :url :status :res[content-length] - :response-time ms\n'
//                      + 'Request headers: :req[header]\n'
//                      + 'Request body: :req[body]\n'
//                      + 'Response headers: :res[header]\n'
//                      + 'Response body: :res[body]';


//express midleware module for session data management
app.use(session({
   secret: "Eee sala cup namde", 
   resave: true, 
   saveUninitialized: false
}))

//Routes 
const loginRoute = require('./routes/loginRoutes'); 
const registerRoute = require('./routes/registerRoutes'); 
const logoutRoute = require('./routes/logoutRoute');

//API routes
const postsApiRoute = require('./routes/api/posts'); 

//app.use(morgan(logFormat));
app.use("/login", loginRoute); 
app.use("/register", registerRoute); 
app.use('/logout', logoutRoute);

app.use("/api/posts", postsApiRoute); 

const server = app.listen(port, (req,res,next) => {
   console.log("Server listening on " + port); 
}) 

app.get("/", middleware.requireLogin, (req,res,next) => {

   var payload = {
      pageTitle: "Home",
      userLoggedIn : req.session.user
   }
  
   res.status(200).render("home", payload); 
})