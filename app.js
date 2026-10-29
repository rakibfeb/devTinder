const express = require('express')
const { connectDB } = require('./src/config/database')
const User = require('./src/models/user')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require ("./routes/request")


const app = express()
app.use(express.json())
app.use(cookieParser())



const feed = require('./src/controller/feed')

app.use("/request",requestRouter)
app.use("/profile",profileRouter)
app.use("/",authRouter)



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