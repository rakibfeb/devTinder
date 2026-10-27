const express = require('express');
const User = require('../models/user')

const app = express();

// app.get("/feed",(req,res)=>{
//     console.log("inside feed");
//     res.send("Feed");
// })

async function feed  (req,res){
    console.log("inside feed");

    const users = await User.find({city:"kolkata"})
    console.log(users.map(user => console.log(user)))


    res.send("Feed");
}




module.exports = feed ; 