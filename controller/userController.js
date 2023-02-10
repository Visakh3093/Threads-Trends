const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const addressModel = require('../models/addressModel')
const offerModel = require("../models/offerModel")
const message = require("../config/sms")
const bcrypt = require('bcrypt');
const ordersModel = require("../models/ordersModel");



const getLogin = (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
  }
};

const getRegister = (req, res) => {
  try {
    res.render("register");
  } catch (err) {
    console.log(err);
  }
};

const userLogin = (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
  }
};




const addAddress = async (req,res)=>{
  try{
      userSession = req.session
    const Address = await new addressModel({
      userId:userSession.user_id,
      fullname:req.body.fullname,    
      state:req.body.state,
      city:req.body.city,      
      houseNo:req.body.houseNo,
      roadName:req.body.roadName,
      pincode:req.body.pincode,
      phone1:req.body.phone1,
      phone2:req.body.phone2


    })

    await Address.save().then(()=>{
      console.log('address added')
    })
    res.redirect('/addressHome')

  }
  catch(err)
  {
    console.log(err)
  }
}



const addressHome = async (req,res)=>{

  try{
 const userSession = req.session
   const addressData = await addressModel.find({userId:userSession.user_id})
   if(addressData){
    res.render('addressHome',{Address:addressData,addressId:1})
   }
   else
   {
    res.render('addressHome',{addressId:0})
   }
      
    }

  
  catch(err){
    console.log(err)
  }
}

const order = async (req,res)=>{
  try{
    const userSession = req.session
    if(userSession.user_id){
      const userData = await userModel.findById({_id:userSession.user_id})
      const completeUser = await userData.populate("cart.item.productId")
      
      if(completeUser.cart.totalPrice > 0){

        const Orders = await new ordersModel({
          userId:userSession.user_id,
          payment:req.body.Payment,
          fullname:req.body.fullname,
          phone1:req.body.phone1,
          pincode:req.body.pincode,
          state:req.body.state,
          city:req.body.city,
          houseNo:req.body.houseNo,
          roadName:req.body.roadName,
          prodcuts:completeUser.cart,


        })
        await Orders.save().then(()=>console.log('order Saved'))

      }
    }
         

    
    res.render('orderSucces')


  }catch(err){
    console.log(err)
  }
}


const loadOrder = async(req,res)=>{
  try{
  

    const userSession = req.session;

    const orderData = await ordersModel.find({userId:userSession.user_id})
    console.log(orderData)    

    res.render('userOrder',{Order:orderData,id:userSession.user_id})

  }
  catch(err)
  {
    console.log(err)
  }
}




const checkOut = async (req, res) => {
  try {
    const userSession = req.session
    console.log(userSession.user_id)

const id = req.query.addressid

const userData =  await userModel.findById({_id:userSession.user_id})
const completeUser = await userData.populate("cart.item.productId")

if(userSession.user_id && completeUser.cart.totalPrice){
  const addressData = await addressModel.find({userId:userSession.user_id})
  const selectAddress = await addressModel.findOne({_id:id})
  const offer = await offerModel.findOne({_id:userSession.user_id})

  // if(userSession.couponTotal == 0){
  //   console.log('8')
  //   userSession.couponTotal = userData.cart.totalPrice
  //   console.log('9')
  // }

    res.render("checkout",{
      
      cartProducts:completeUser.cart,
      // offer:userSession.couponTotal,
      // nocoupon,qty:completeUser.cart.item.qty,
      addSelect:selectAddress,
      userAddress:addressData,
      
    });
  }
  else
  {
    res.redirect('/cart')
  }
  } catch (err) {
    console.log(err.message);
  }
};

const deleteAddress = async(req,res)=>{
  try{


    const id = req.query.addressid
  

    await addressModel.findByIdAndDelete({_id:id})
    res.redirect('/checkOut')

  }
  catch(err){
    console.log(err)
  }
}


let Newusers;

const addUser = async (req, res, next) => {
  try {

    const userData = await userModel.findOne({email:req.body.email})
    const userData1 = await userModel.findOne({mobile:req.body.mobile})

    if(userData || userData1){
      res.render('register',{message:'this account is already exist'})
    }
    else
    {
     Newusers = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      isAdmin: false,
      isVerified: true,
    }
    next();
  }
  } catch (err) {
    console.log(err);
  }
};
let newOtp;
const loadOtp = async (req,res,next)=>{
  try{

    const userData = Newusers
    const mobile = userData.mobile

    newOtp = message.sendMessage(mobile,res)
    console.log(newOtp)

    res.render('otp',{userData,newOtp,message:""})


  }catch(err){
    console.log(err)
  }
}

const verifyOtp = async (req,res,next)=>
{
  try{
    const userData = Newusers
    const otp = newOtp
    console.log(otp)
    console.log(req.body.otp)

    if(otp == req.body.otp)
    {
      // const Password = await bcrypt.hash(req.body.password,10)
      const user = await new userModel({
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        password:req.body.password,
        isAdmin:false,
        isVerified: true
      })
      await user.save().then(()=>{ 
        console.log('registed succesfully')
      })
      if(user){
        res.render('login')
      }
      else{
        res.render('otp',{message:'invalid otp',userData,newOtp})
      }

    }
    else
    {
      res.render('otp',{message:'visakh',userData,newOtp})

    }

  }
  catch(err){
    console.log(err)
  }
}

const verifyuser = async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const userData = await userModel.findOne({ email: userEmail });
    if (userData) {
      if (userData.isVerified === true) {
        if (userData.password === userPassword) {
          req.session.user_id = userData._id;
          req.session.user = userData.email;
          next();
        } else {
          // console.log("password error");
         res.render("login", { message: "wrong password" });
        }
      } else {
        // console.log("user blocked");
      res.render("login", { message: "user blocked" });
      }
    } else {
      // console.log("user not found");
      res.render("login", { message: "user not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

getUserHome = (req, res) => {
  try {
    res.render("userHome", { id: req.session.user_id });
  } catch (err) {
    console.log(err);
  }
};

getShop = async (req, res) => {
  try {
    const productData = await productModel.find();

    if (productData) {
      res.render("shop", { id: req.session.user_id, product: productData });
    } else {
      console.log("cant get");
    }
  } catch (err) {
    console.log(err.message);
  }
};

const isLogin = (req, res, next) => {
  try {
    if (req.session.user) {
      res.render("userHome", { id: req.session.user_id });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

const isLogout = (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

const singleProduct = async (req, res) => {
  try {
    const id = req.query.id;

    const productData = await productModel.find();
    const singleProduct = await productModel.findById({ _id: id });
    console.log(singleProduct);

    if (singleProduct) {
      res.render("singleProduct", {
        product: productData,
        single: singleProduct,
        id: req.session.user_id,
      });
    } else {
      console.log("cant get single product");
    }
  } catch (err) {
    console.log(err);
  }
};

const getContact = (req, res, next) => {
  try {
    if (req.session.user_id) {
      res.render("contact");
    } else {
      next();
    }
  } catch (err) {
    console.log(err.message);
  }
};
const isUser = (req,res,next)=>{
    try{
        if(!req.session.user_id){
          res.render('login')
        }
        else
        {
            next()
        }

    }
    catch(err){
        console.log(err)
    }
}

const loadCart = async (req,res)=>{
    try{

        const userData = await userModel.findById({_id:req.session.user_id})
        const compleatUser = await userData.populate('cart.item.productId')
        res.render('cart',{id:req.session.user_id,cartProduct:compleatUser.cart})
    }
    catch(err)
    {
        console.log(err)
    }
}
const addToCart = async (req,res)=>{

    try{
        const productId = req.query.id;
        userSession = req.session
        const userData = await userModel.findById({_id: userSession.user_id})
        const productData = await productModel.findById({_id:productId})
        userData.addToCart(productData)
        res.redirect('/cart')

    }
    catch(err){
        console.log(err)
    }

}

const editCart = async (req,res)=>{
    try{
        const id = req.query.id
        userSession = req.session
        const userData = await userModel.findById({_id:userSession.user_id})
        const foundProduct = userData.cart.item.findIndex(
            (objInItem)=> objInItems.productId == id
        )
        const qty = {a: parseInt(req.body.qty)}


        userData.cart.totalPrice = 0;

        const price = userData.cart.item[foundProduct].price
        const totalPrice = userData.cart.item.reduce((acc,curr)=>{
            return acc + curr.price * curr.qty
        },0)
        userData.cart.totalPrice = totalPrice
        await userData.save()
        res.json({totalPrice,price})
    }
    catch(err)
    {
        console.log(err)
    }
}

const deleteCart = async (req,res)=>{
    try{
        const productId = req.query.id
        userSession = req.session
        const userData = await userModel.findById({_id:userSession.user_id})
        await userData.removefromCart(productId)
        res.redirect('/cart')

    }
    catch(err){
        console.log(err)
    }
}  

// const loadWishlist = (req,res)=>{
//   try{
//     res.render('wishList')
//   }
//   catch(err){
//     console.log(err)
//   }
// }


const loadWishlist = async (req, res) => {
  try {
    const userSession = req.session
    const userData = await userModel.findById({ _id: userSession.user_id });
    const completeUser = await userData.populate("wishlist.item.productId");
    console.log(completeUser);
    res.render("wishList", {

      id: userSession.userId,
      wishlistProducts: completeUser.wishlist,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const addToWishlist = async (req, res) => {
  try {
    const productId = req.query.id;
    userSession = req.session;
    const userData = await userModel.findById({ _id: userSession.user_id });
    const productData = await productModel.findById({ _id: productId });
    userData.addToWishlist(productData);
    console.log(productData);
    res.redirect("/shop");
  } catch (error) {
    console.log(error.messsage);
  }
};


const addCartDeleteWishlist = async (req, res) => {
  try {
    userSession = req.session;
    const productId = req.query.id;
    const userData = await userModel.findById({ _id: userSession.user_id });
    const productData = await productModel.findById({ _id: productId });
    const add = await userData.addToCart(productData);
    if (add) {
      await userData.removefromWishlist(productId);
    }
    res.redirect("/shop");
  } catch (error) {
    console.log(error.message);
  }
};

const deleteWishlist = async (req, res) => {
  try {
    const productId = req.query.id;
    userSession = req.session;
    const userData = await userModel.findById({ _id: userSession.user_id });
    await userData.removefromWishlist(productId);
    res.redirect("/whishlist");
  } catch (error) {
    console.log(error.message);
  }
};








module.exports = {
  getLogin,
  getRegister,
  addUser,
  userLogin,
  verifyuser,
  getUserHome,
  isLogin,
  isLogout,
  getShop,
  singleProduct,
  getContact,
  checkOut,
  loadCart,
  isUser,
  addToCart,
  deleteCart,
  editCart,
  loadWishlist,
  addressHome,
  addAddress,
  loadOtp,
  verifyOtp,
  deleteAddress,
  order,
  loadOrder,
  addToWishlist,
  deleteWishlist,
  addCartDeleteWishlist
};
