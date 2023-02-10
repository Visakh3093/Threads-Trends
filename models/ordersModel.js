const mongoose = require ('mongoose')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'users',
        required:true
    },
    payment:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    phone1:{
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
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
      },
      products: {
        item: [{
          productId: {
            type: mongoose.Types.ObjectId,
            ref: 'products'
            // required:true
          },
          qty: {
            type: Number
            // required:true
          },
          price: {
            type: Number
          }
        }],
        totalPrice: {
          type: Number,
          default: 0
        }
      },
    
      status: {
        type: Boolean,
        default: 'true'
      }
      , 
      productReturned: [{
        type: Number
      }]

    


})

module.exports = mongoose.model('Orders',orderSchema)