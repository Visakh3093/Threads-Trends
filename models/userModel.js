const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        unique:true

    },

    lname:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true 
    },

    mobile:{
         type:Number,
         required:true
         
    },
    
    password:{ 
        type:String,
        required:true 
    },
    isAdmin:Boolean,
    isVerified:Boolean



    

})

module.exports=mongoose.model('users',userSchema)