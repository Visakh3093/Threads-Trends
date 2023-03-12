const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const addressModel = require('../models/addressModel')
const offerModel = require("../models/offerModel")
const message = require("../config/sms")
const bcrypt = require('bcrypt');
const ordersModel = require("../models/ordersModel");
const RazorPay = require('razorpay')
const bannerModel = require('../models/bannerModel')



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
    const Address =  new addressModel({
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
    res.redirect('/checkout')

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
      if(req.body.address){
      const addressid = req.body.address
      const addressData = await addressModel.findById({_id:addressid})

      const userData = await userModel.findById({_id:userSession.user_id})
      const completeUser = await userData.populate("cart.item.productId")
      console.log(completeUser.cart)
    

        const Orders = await ordersModel({
          userId:userSession.user_id,
          payment:req.body.Payment,
          fullname:addressData.fullname,
          phone1:addressData.phone1,
          pincode:addressData.pincode,
          state:addressData.state,
          city:addressData.city,
          houseNo:addressData.houseNo,
          roadName:addressData.roadName,
          products:completeUser.cart,


        })
      //  console.log('Orders'+Orders)
         await Orders.save().then(()=>console.log('order Saved'))

        // userSession.currentOrder = orderData._id
        // req.session.currentOrder = order._id

      
if(req.body.Payment == 'cod'){
  res.redirect('/orderSucces')
}
else if(req.body.Payment === 'Razorpay')
{
  res.render('razorpay',{order:completeUser.cart.totalPrice,id:userSession.user_id})

}


    }  
    else
    {
      res.render('checkout')
    }
  }


    
   


  }catch(err){
    console.log(err)
  }
}


const loadOrder = async(req,res)=>{
  try{
  

    const userSession = req.session;

    const orderData = await ordersModel.find({userId:userSession.user_id}).sort({createdAt:-1})
  

    res.render('userOrder',{Order:orderData,id:userSession.user_id})

  }
  catch(err)
  {
    console.log(err)
  }
}

const orderDetails = async (req,res)=>{
  try{
const userData = await userModel.findById({_id:req.session.user_id})
    const order = await ordersModel.findById({_id:req.query.id})
    console.log(order._id)
  
    const completeOrder = await order.populate('products.item.productId')
    

    
    res.render('orderDetials',{order:completeOrder,id:req.session.user_id,orders:order,orderId:order._id,user:userData})

  }
  catch(err)
  {
    console.log(err)
  }
}




const checkOut = async (req, res) => {
  try {
    const userSession = req.session
    // console.log(userSession.user_id)

const id = req.query.addressid

const userData =  await userModel.findById({_id:userSession.user_id})
const completeUser = await userData.populate("cart.item.productId")

if(userSession.user_id && completeUser.cart.totalPrice){
  const addressData = await addressModel.find({userId:userSession.user_id})
  
  

    res.render("checkout",{
      
      cartProducts:completeUser.cart,
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
    console.log(id)
  

    await addressModel.findByIdAndDelete({_id:id})
    res.redirect('/checkOut')
    

  }
  catch(err){
    console.log(err)
  }
}


let newUsers

const addUser = async (req,res,next)=>{
   

  try{

    const userEmail = await userModel.findOne({email:req.body.email})
    const userMobile = await userModel.findOne({mobile:req.body.mobile})

    if(userEmail || userMobile){

      res.render('register',{message:"This account is already exist"})
    }
    else 
    {
       newUsers = {
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        password:req.body.password
      }

      next()

    }

  }
  catch(err)
  {
    console.log(err)
  }

}
let newOtp;

const loadOtp = async(req,res)=>{
  try{
    const userData = newUsers
    const mobile = userData.mobile
console.log(userData)
     newOtp = message.sendMessage(mobile,res)
    console.log(newOtp)

    res.render('otp',{user:userData,message:""})

  }catch(err){
    console.log(err)
  }
}


const verifyOtp = async (req,res)=>{
try{

  const userData = newUsers
  const otp = newOtp

  console.log(otp)


  if(otp == req.body.otp)
  {
    const users = await new userModel({
      name:userData.name,
      email:userData.email,
      mobile:userData.mobile,
      password:userData.password,
      isAdmin:false,
      isVerified: true
    })

    await users.save().then(()=>console.log('user Saved'))
    res.render('login')
  }
  else
  {
    res.render('otp',{message:'invalid otp'})
  }

  

}
catch(err)
{
  console.log(err);
}
}


const cancelOrder = async(req,res)=>{
  try{
    const id = req.query.id
    await ordersModel.findByIdAndUpdate({_id:id},{
      $set:{status:'Canceled'}
    })
    res.redirect('/loadOrders')
  }catch(err)
  {
    console.log(err)
  }

}


const verifyuser = async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const userData = await userModel.findOne({ email: userEmail });
    if (userData) {
      console.log(userData)
      if (userData.isVerified) {
        if (userData.password === userPassword) {
          req.session.user_id = userData._id;
          req.session.user = userData.email;
          res.redirect('/home')
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

const getUserHome = async (req, res) => {
  try {

    const banner = await bannerModel.find({isAvailable:true})
    console.log('banner',banner)
    res.render("userHome", { id: req.session.user_id,banner:banner });
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
      const userSession = req.session

        const userData = await userModel.findById({_id:userSession.user_id})

        // console.log(req.session.user_id)
        const compleatUser = await userData.populate('cart.item.productId')
    
        res.render('cart',{id:userSession.user_id,cartProduct:compleatUser.cart})
    }
    catch(err)
    {
        console.log(err)
    }
}


const addToCart = async (req,res)=>{

    try{
        const productId = req.body.id;
        userSession = req.session
        const userData = await userModel.findById({_id: userSession.user_id})
        const productData = await productModel.findById({_id:productId})
        userData.addToCart(productData)
        res.redirect('/shop')

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

const razorpayCheckout = async (req, res,next) => {
  try{
    
  userSession = req.session;
  const userData = await userModel.findById({ _id: userSession.user_id });
  const completeUser = await userData.populate("cart.item.productId");
  var instance = new RazorPay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
  });
  console.log(req.body);
  console.log(completeUser.cart.totalPrice);
  let order = await instance.orders.create({
    amount: completeUser.cart.totalPrice * 100,
    currency: "INR",
    receipt: "receipt#1",
  });
  res.status(201).json({
    success: true,
    order,
  })
  next()
}
catch(err){
  console.log(err)
}
};


const orderSucces = async (req,res)=>{
  try{
    await userModel
            .findByIdAndUpdate(
              { _id: req.session.user_id },
              {
                $set: {
                  "cart.item": [],
                  "cart.totalPrice": "0",
                },
              },
              { multi: true }
            )
    res.render('orderSucces')

  }
  catch(err)
  {
    console.log(err)
  }
}

const userProfile = async (req,res)=>{
  try{
    
    const userSession = req.session

    const userData = await userModel.findById({_id:userSession.user_id})

    res.render('userProfile',{id:userSession.user_id,user:userData})

  }
  catch(err)
  {
    console.log(err)
  }
}
const loadEditprofile= async (req,res)=>{
  try{
    const userData = await userModel.findById({_id:req.session.user_id}) 
    res.render('editProfile',{user:userData})

  }
  catch(err)
  {
    console.log(err)
  }
}

const editProfile = async (req,res)=>{
  try{
    

  await userModel.findByIdAndUpdate({_id:req.session.user_id},{
      $set:{
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile

      }
    })
    res.redirect('/userProfile')
    console.log('succes')



  }
  catch(err)
  {
    console.log(err)
  }
}


const loadeditAddress = async (req,res)=>{
  try{

    const id = req.query.addressid
    console.log(id)
    const address = await addressModel.findById({_id:id})
    res.render('editAddress',{address:address})



  }
  catch(err){
    console.log(err)
  }
}

const editAddress = async (req,res)=>{
  try{
    const id = req.body.id
    console.log(id)
    const userSession = req.session
     await addressModel.findByIdAndUpdate({_id:id},
      {$set:{
        userId:userSession.user_id,
      fullname:req.body.fullname,    
      state:req.body.state,
      city:req.body.city,      
      houseNo:req.body.houseNo,
      roadName:req.body.roadName,
      pincode:req.body.pincode,
      phone1:req.body.phone1,
      phone2:req.body.phone2

      }})
      console.log('1')
      res.redirect('/checkout')

  }
  catch(err)
  {
    console.log(err)
  }
}



const loadProfileAddress = async (req,res)=>{
  try{

    const userSession = req.session
    console.log(userSession.user_id)

    const addressData = await addressModel.find({userId:userSession.user_id})
    console.log(addressData)

    res.render('editAddressProfile',{userAddress:addressData})

  }
  catch(err)
  {
    console.log(err)
  }
}



const updateCartItem = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.session.user_id;

    const user = await userModel
      .findById(userId)
      .populate("cart.item.productId");

    const cartItem = user.cart.item.find(
      (item) => item.productId._id.toString() === productId.toString()
    );

    const productPrice = cartItem.productId.price;

    const qtyChange = qty - cartItem.qty;

    cartItem.qty = qty;
    cartItem.price = productPrice * qty;

    // recalculate the total price of the cart
    const totalPrice = user.cart.item.reduce(
      (acc, item) => acc + item.price,
      0
    );
    user.cart.totalPrice = totalPrice;

    // mark the cart and totalPrice fields as modified
    user.markModified("cart");
    user.markModified("cart.totalPrice");

    // save the updated user document
    await user.save().then((data) => {
      console.log(data);
    });

    // send the updated subtotal and grand total back to the client
    const subtotal = user.cart.item.reduce((acc, item) => acc + item.price, 0);
    const grandTotal = subtotal + 45;

    res.json({ subtotal, grandTotal, productPrice, qtyChange });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating cart item");
  }
};

const returnReqst = async (req,res)=>{
  try{
    
    const id = req.query.id
    await ordersModel.findByIdAndUpdate({_id:id},{$set:{status:'Rqstd'}})
    res.redirect("/loadOrders")

  }
  catch(err)
  {
  console.log(err)
}
}
 const usrDltAddress = async(req,res)=>{
  try{
    
    const id = req.query.id
    await addressModel.findByIdAndDelete({_id:id})
    res.redirect('/editAdressProfile')

  }
  catch(err)
  {
    console.log(err)
  }
 }


 const usrEditAddress = async (req,res)=>{
  try{
    const id = req.body.id
    console.log(id)
    const userSession = req.session
     await addressModel.findByIdAndUpdate({_id:id},
      {$set:{
        userId:userSession.user_id,
      fullname:req.body.fullname,    
      state:req.body.state,
      city:req.body.city,      
      houseNo:req.body.houseNo,
      roadName:req.body.roadName,
      pincode:req.body.pincode,
      phone1:req.body.phone1,
      phone2:req.body.phone2

      }})
    
      res.redirect('/editAdressProfile')

  }
  catch(err)
  {
    console.log(err)
  }
}


const loadusrEditAddress = async (req,res)=>{
  try{

    const id = req.query.addressid
    console.log(id)
    const address = await addressModel.findById({_id:id})
    res.render('editAddressform',{address:address})


  }
  catch(err){
    console.log(err)
  }

}




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
  addCartDeleteWishlist,
  cancelOrder,
  orderDetails,
  razorpayCheckout,
  orderSucces,
  userProfile,
  loadEditprofile,
  editProfile,
  loadeditAddress,
  editAddress,
  loadProfileAddress,
  updateCartItem,
  returnReqst,
  usrDltAddress,
  usrEditAddress,
  loadusrEditAddress

};
