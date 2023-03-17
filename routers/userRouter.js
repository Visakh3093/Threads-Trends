const express = require('express')
const userController = require('../controller/userController')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const nocache = require('nocache')

const router = express()

router.use(session({

    secret:'qwerty',
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60*24*7*24
    }
}))

router.use(cookieParser())  
router.use(nocache())

router.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  }); 
 
router.use(express.json()); 
router.use(express.urlencoded({extended:true}))

router.set("view engine", "ejs");
router.set("views", "./views/user");
            
            
router.get('/',userController.isLogin,userController.getUserHome)               

router.get('/login',userController.getLogin)
 
router.get('/register',userController.isLogin,userController.getRegister)

router.get('/logout',userController.isLogout)

router.get('/home',userController.isUser,userController.getUserHome)

router.get('/shop',userController.getShop)    

router.get('/contact',userController.getContact,userController.getLogin)

router.get('/checkOut',userController.isUser,userController.checkOut)

router.get('/singleProduct',userController.singleProduct)     

router.get('/cart',userController.isUser,userController.loadCart)

router.get('/deleteCart',userController.isUser,userController.deleteCart)

router.get('/editCart',userController.isUser,userController.editCart)

router.get('/wishList',userController.isUser,userController.loadWishlist)

router.get('/addressHome',userController.isUser,userController.addressHome)

router.get('/dltAddress',userController.isUser,userController.deleteAddress)

router.get('/loadOrders',userController.isUser,userController.loadOrder)

router.get('/addToWishlist',userController.isUser,userController.addToWishlist)

router.get('/deleteWishlist',userController.isUser,userController.deleteWishlist)

router.get('/addCartDeleteWishlist',userController.isUser,userController.addCartDeleteWishlist)

router.get('/calcelOrder',userController.isUser,userController.cancelOrder)         

router.get('/orderDetails',userController.isUser,userController.orderDetails)         

router.get('/orderSucces',userController.isUser,userController.orderSucces)

router.get('/userProfile',userController.isUser,userController.userProfile)

router.get('/editProfile',userController.isUser,userController.loadEditprofile)

router.get('/editAddress',userController.isUser,userController.loadeditAddress)

router.get('/editAdressProfile',userController.isUser,userController.loadProfileAddress)

router.get('/returnOrder',userController.isUser,userController.returnReqst)

router.get('/usrDltAddress',userController.isUser,userController.usrDltAddress)

router.get('/usrEditAddress',userController.isUser,userController.loadusrEditAddress)

// post method  

router.post('/register',userController.addUser,userController.loadOtp)

router.post('/addtocart',userController.isUser,userController.addToCart)

router.post('/login',userController.verifyuser)

router.post('/addAddress',userController.isUser,userController.addAddress)

router.post('/otp',userController.verifyOtp)

router.post('/order',userController.isUser,userController.order)

router.post('/razorpay',userController.isUser,userController.razorpayCheckout,userController.orderSucces)

router.post('/editProfile',userController.isUser,userController.editProfile)

router.post('/editaddress',userController.isUser,userController.editAddress)

router.post('/usrEditAddress',userController.isUser,userController.usrEditAddress)

router.post('/updateCartItem',userController.isUser,userController.updateCartItem)

module.exports = router