


const authMiddleware=("/",async (req,res,next) =>{
    // console.log("inside auth mid")
    // console.log(req.cookies);

    const {token}= req.cookies;
    if(!token){
        res.send("unathorized access")
    }


    const decoded = await jwt.verify(token,"Secret key")
    if(!decoded){
        res.send("unathorized access")
    }
    userId = decoded.id
    // console.log(decoded.id)
    // req.user = userId;
    next()
})

module.exports = authMiddleware