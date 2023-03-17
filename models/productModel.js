const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
        
    },
    quantity:{
        type:Number,
        required:true
    },
    category:{   
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    rating:{
        type:Number, 
        required:true

    },
    image:{
       type:Array
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    sales:{
        type:Number,
        default:0
    },
    quantity:{
        type:Number,
        required:true
    }           



})


module.exports = mongoose.model('products',productSchema)     