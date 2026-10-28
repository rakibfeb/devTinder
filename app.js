const express = require('express')
const { connectDB } = require('./src/config/database')
const User = require('./src/models/user')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")


const app = express()
app.use(express.json())
app.use(cookieParser())


// app.use("/",(req,res,next)=>{
//     console.log("check is user logged in");
//     // res.send("check");
//     next();
//     res.send("check");
// })


// this middleware will be executed for every request to the /api route 
// app.use("/api",(req,res,next)=>{    
//     console.log("Are you logged in?");
//     next();
// })

app.use("/api",async (req,res,next) =>{
    console.log("inside auth mid")
    console.log(req.cookies);

    const {token}= req.cookies;
    if(!token){
        res.send("unathorized access")
    }


    const decoded = await jwt.verify(token,"Secret key")
    if(!decoded){
        res.send("unathorized access")
    }
    userId = decoded.id
    console.log(decoded.id)
    // req.user = userId;
    next()
})

const feed = require('./src/controller/feed')













app.get("/api/feed", feed)


process.loadEnvFile();
const port = process.env.PORT;


connectDB().then(() => {
    console.log("DB connected successfully!")
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    });
}).catch((err) => {
    console.log("DB connection failed")
})