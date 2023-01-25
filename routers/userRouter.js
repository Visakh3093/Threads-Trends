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


router.get('/',userController.isLogin,userController.getUserHome)

router.get('/login',userController.isLogin,userController.getLogin)

router.post('/login',userController.verifyuser,userController.getUserHome)
 
router.get('/register',userController.isLogin,userController.getRegister)

router.post('/register',userController.addUser,userController.userLogin)

router.get('/logout',userController.isLogout)

router.get('/home',userController.isLogin,userController.getUserHome)

router.get('/shop',userController.getShop)

router.get('/cart',userController.getCart,userController.getLogin)    

router.get('/contact',userController.getContact,userController.getLogin)





router.get('/singleProduct',userController.singleProduct)
 
 
 


module.exports = router