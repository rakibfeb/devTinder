const express = require('express')
const router = express.Router()
const User = require("../src/models/user")
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middlewares/auth")
const bcrypt = require("bcrypt")


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

router.patch("/edit", async (req, res) => {

    const editable = ["profilePic","bio","city","gender","age","firstName","lastName","interests","skills"]

    const { _id:userId, ...updateData } = req.body;
    // console.log(userId, updateData)

    // updateData.map((f)=>{
    //     if(!editable.exists(f)){
    //         updateData.pop(f);
    //     }
    // })

    const invalid = Object.keys(updateData).filter((k)=> !editable.includes(k))

    if(invalid.length){
        return res.send("You can edit these fields: "+ invalid)
    }
    try {
        await User.findOneAndUpdate({ _id: userId }, updateData, { runValidators: true })
        res.send("user data updated successfully!")
    }
    catch (err) {
        res.status(500).send("something went wrong while updating data!")
    }

})

router.patch("/edit/password",authMiddleware, async (req,res)=>{
    
    try{
        const user = await User.findById(req.user._id)
        if(!user){
        return res.send ("user not found")
        }
    const {oldPassword,newPassword} =req.body
    console.log(oldPassword,newPassword)
    if(!oldPassword || !newPassword) return res.send("password fields are missing")
    const valid = await bcrypt.compare(oldPassword,user.password);
    
    if(!valid){
        return res.send ("Your password is wrong")
    }
    
    try{
        const hashed = await  bcrypt.hash(newPassword,10)
        await User.findByIdAndUpdate(user._id,{password:hashed})
    }catch(err){
        console.log(err)
    }
    res.send("password changed successfully!")
     }
    catch(err){
        console.log(err)
    }

})

module.exports = router