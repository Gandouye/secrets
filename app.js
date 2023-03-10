//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.set('strictQuery', false);
const connectionStr = "mongodb://127.0.0.1:27017/userDB";
mongoose.connect(connectionStr ,  { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
   if(err){
    console.log(err);
   } else {
    console.log("Good");
   }
 });

userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRETKEY, encryptedFields:['password']});  // create before defining the model

const User = new mongoose.model("User", userSchema);


app.post("/register", (req, res)=>{
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render("secrets")
                }
            }
        }
    });
});



app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});



app.listen(3000, function(){
    console.log("Server started on port 3000.");
});