const express =require('express')

const app = express()




app.get("/",(req,res)=>{
    throw new Error("New Error");
})
app.get("/getData",(req,res)=>{

    try{
        throw new Error("Error was not handled");
        res.send("Data sent to user");
    }
    catch(err){
        res.status(500).send('error was handled using try catch')
    }
    
    
})
app.use("/",(err,req,res,next)=>{
    res.status(500).send('Error was handled using global handler')
})



process.loadEnvFile();
app.listen(process.env.PORT,()=>{
    console.log(`listening on port number ${process.env.PORT}`);
    
})