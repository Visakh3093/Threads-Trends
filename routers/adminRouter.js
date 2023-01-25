const express = require('express')
const adminController = require('../controller/adminController')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const nocache = require('nocache')
const multer = require('../util/multer')



const router = express()

router.use(session({
    secret:'ghjk',
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

// get method


router.get('/',adminController.isLogin,adminController.adminLogin)



router.get('/product',adminController.displayProduct)

router.get('/userlist',adminController.loadadminUser)

router.get('/blockUser',adminController.blockUser) 
 
router.get('/addProduct',adminController.addProduct)

router.get('/dltProduct',adminController.dltProduct)

router.get('/logout',adminController.isLogout)

router.get('/editProduct',adminController.getEdit)



// post method 

router.post('/',adminController.verifyAdmin,adminController.getAdmin)

router.post('/addProduct',multer.upload.array('simage',3),adminController.loadProduct,adminController.displayProduct)

router.post('/editProduct',multer.upload.array('simage',3),adminController.editProduct)


module.exports = router
