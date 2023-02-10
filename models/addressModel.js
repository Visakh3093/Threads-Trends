const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({

    userId :{
        type:mongoose.Types.ObjectId,
        ref:'users',
    },
    fullname:{
        type:String,
        uppercase:true,
        required:true
    },
    phone1:{
        type:Number,
        required:true
    },
    phone2:{
        type:Number,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    state:{
        type:String,
        required:true
        
    },
    city:{
        type:String,
        required:true
    },
    houseNo:{
        type:String,
        required:true 
    },
    roadName:{
        type:String,
        required:true
    }


})

module.exports = mongoose.model('Address',addressSchema)