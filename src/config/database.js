const mongoose = require('mongoose');



const connectDB = async ()=>{

 await mongoose.connect('mongodb+srv://rakib8feb_db_user:lwauPyfpZmNVP3Jr@cluster0.gsz5mwd.mongodb.net/devTinder')
}

module.exports = {connectDB}