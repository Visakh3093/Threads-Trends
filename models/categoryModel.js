const mongoose = require ('mongoose')

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        uppercase:true,
        unique:true
    },
    isAvailable:{
        type:Number,
        default:1
    }
})

module.exports = mongoose.model('Category',categorySchema)