const express = require('express')

const app = express()



app.use("/login",(req,res)=>{
    res.send('You are logged in');
})

app.use("/",(req,res)=>{
    res.send('Explore... ')
})



app.listen(3000,()=>{
    console.log('Server is running on port 3000')
});
