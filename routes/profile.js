const express = require('express')
const router = express.Router()
const User = require("../src/models/user")
const jwt = require("jsonwebtoken")


router.get("/me", async (req,res)=>{
    console.log(req.cookies.token)
    const token = req.cookies.token;

    if(!token) res.send("Please logIn!")
        
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

router.get("/view", async (req, res) => {

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
        res.status(500).send(err.message)
    }
})

router.delete("/profile/remove", async (req, res) => {

    const { emailId } = req.body;

    try {
        await User.deleteOne({ emailId: emailId })
        res.send(`user with emailId ${emailId} deleted successfully!`)
    }
    catch (err) {
        res.status(500).send("something went wrong while deleting data!")
    }
})

router.patch("/profile/edit", async (req, res) => {

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

module.exports = router