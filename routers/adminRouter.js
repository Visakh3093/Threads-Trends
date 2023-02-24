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



// post method

router.post("/", adminController.verifyAdmin, adminController.getAdmin);

router.post("/addProduct",multer.upload.array("simage"),adminController.loadProduct,adminController.displayProduct);

router.post("/editProduct",multer.upload.array("simage"),adminController.editProduct);

router.post("/adminCategory",adminController.isLogin,adminController.addCategory)

module.exports = router;
