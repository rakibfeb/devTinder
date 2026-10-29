const express = require("express")

const router = express.Router()

router.post("/like",(req,res)=>{
    res.send("liked")
})

router.post("/pass",(req,res)=>{
    res.send("passed")
    
})

router.post("/view",(req,res)=>{
    res.send("request view")
    
})

module.exports = router