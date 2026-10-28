const express = require('express')

const router = express.Router();



router.post("/signup", async (req, res) => {


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