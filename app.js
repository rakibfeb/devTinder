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
app.post("/signup", async (req, res) => {


    const { firstName, lastName, emailId, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);


    const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashedPassword
    })


    try {
        await user.save()
        console.log(user)
        res.send("user data saved!")

    } catch (err) {
        console.log(err)
        res.status(500).send("something went wrong while signup \n" + err.message)
    }
})

app.post("/login", async (req, res) => {
const {emailId,password} = req.body;

        const user = await User.findOne({emailId: emailId})
        if(!user){
            res.cookie("token", "");
            res.status(404).send("user not found!")
        }

        const ismatch = await bcrypt.compare(password, user.password)
        if(!ismatch){
            res.cookie("token", "");
            res.status(400).send("password is incorrect!")
        }
        try{
            const token = await jwt.sign({id:user._id},"Secret key")

        res.cookie("token", token);
        }catch(err){
            console.log(err.message)
        }
        res.send("login successful!")
    
       

})

app.get("/me", async (req,res)=>{
    console.log(req.cookies.token)
    const token = req.cookies.token;


    try{
    const decoded = await jwt.verify(token,"Secret key")

    if(!decoded){
        res.send("login please!")
    }

    const user = await User.findById(decoded.id);
    if(!user){
        res.send("login please!")
    }
    res.send(user)

    }
    catch(err){
        console.log(err.message)
    }
})

app.get("/profile/view", async (req, res) => {

    const {emailId:userEmail, userId } = req.body;
    console.log(userEmail, userId)

    let query;

    if (userEmail) {
        query = { emailId: userEmail };
    }
    else if (userId) {
        query = { _id: userId };
    }
    else {
        res.status(400).send("Please provide either emailId or userId to fetch data!")
    }

    try {
        const user = await User.find(query);
        if (user.length === 0) {
            res.status(404).send("user not found!")
        }
        else {
            res.send(user)
        }

    }
    catch (err) {
        res.status(500).send("something went wrong while geting data!")
    }
})


app.delete("/profile/remove", async (req, res) => {

    const { emailId } = req.body;

    try {
        await User.deleteOne({ emailId: emailId })
        res.send(`user with emailId ${emailId} deleted successfully!`)
    }
    catch (err) {
        res.status(500).send("something went wrong while deleting data!")
    }
})

app.patch("/profile/edit", async (req, res) => {

    const { userId, ...updateData } = req.body;

    console.log(userId, updateData)

    try {
        await User.findOneAndUpdate({ _id: userId }, updateData, { runValidators: true })
        res.send("user data updated successfully!")
    }
    catch (err) {
        res.status(500).send("something went wrong while updating data!")
    }

})

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