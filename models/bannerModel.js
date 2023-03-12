const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({

    image:{
        type:Array
    },
    description:{
        type:String,
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model('Banner',bannerSchema)

