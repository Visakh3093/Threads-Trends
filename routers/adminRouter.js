const express = require("express");
const adminController = require("../controller/adminController");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const nocache = require("nocache");
const multer = require("../util/multer");

const router = express();

router.use(
  session({     
    secret: "ghjk",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 24,
    },
  })
);

router.use(cookieParser());
router.use(nocache());
router.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));     

// get method

router.get("/", adminController.isLogin, adminController.getAdmin);

router.get("/product",adminController.isLogin,adminController.displayProduct);

router.get("/userlist", adminController.isLogin,adminController.loadadminUser);

router.get("/blockUser",adminController.isLogin, adminController.blockUser);
 
router.get("/addProduct",adminController.isLogin, adminController.addProduct);

router.get("/dltProduct",adminController.isLogin, adminController.dltProduct);  

router.get("/logout", adminController.isLogout); 

router.get("/editProduct",adminController.isLogin, adminController.getEdit);

router.get("/adminCategory",adminController.isLogin,adminController.loadCategory)

router.get('/unlistCategory',adminController.isLogin,adminController.unlistCategory)

router.get('/listCategory',adminController.isLogin,adminController.listCategory)

router.get('/loadOrder',adminController.isLogin,adminController.loadOrderList)

router.get('/deliveredOrder',adminController.isLogin,adminController.deliveredOrder)

router.get('/confirmOrder',adminController.isLogin,adminController.confirmOrder)

router.get('/cancelOrder',adminController.isLogin,adminController.cancelOrder)

router.get('/returnOrder',adminController.isLogin,adminController.returnOrder)

router.get('/orderDetail',adminController.isLogin,adminController.orderDetail)

router.get('/CancelReqst',adminController.isLogin,adminController.CancelReqst)

router.get('/salesReport',adminController.isLogin,adminController.salesReport)

router.get('/loadBanner',adminController.isLogin,adminController.loadBanner)

router.get('/loadAddBanner',adminController.isLogin,adminController.loadAddBanner)

router.get('/unlist',adminController.isLogin,adminController.unlist)

router.get('/list',adminController.isLogin,adminController.list)

// post method

router.post("/", adminController.verifyAdmin, adminController.getAdmin);

router.post("/addProduct",multer.upload.array("simage"),adminController.loadProduct,adminController.displayProduct);

router.post("/editProduct",multer.upload.array("simage"),adminController.editProduct);

router.post("/adminCategory",adminController.isLogin,adminController.addCategory)

router.post("/datewiseReport",adminController.isLogin,adminController.datewiseReport)

router.post('/addBanner',multer.upload.array("image"),adminController.addBanner)

module.exports = router;
