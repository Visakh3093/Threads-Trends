const mongoose = require('mongoose')


const offerSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    // usedBy:[{
    //     type:mongoose.Types.objectId,
        
    // }]

})


module.exports = mongoose.model('offer',offerSchema)