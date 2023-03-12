const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const categorySchema = require("../models/categoryModel");
const orderModel = require("../models/ordersModel");
const bannerModel = require("../models/bannerModel")






const adminLogin = (req, res) => {
  try{
    res.render("admin-login");

  }
  catch(err)
  {
    console.log(err)
  }
};

const getAdmin = (req, res) => {

  res.render("admin-page");
};

const addProduct = async (req, res) => {
  try{
    const categoryData = await categorySchema.find({isAvailable:true})
    res.render("add-product",{category:categoryData});
  }
  catch(err)
  {
    console.log(err)
  }
  
};

const loadadminUser = async (req, res) => {
  try {
    const userlist = await userModel.find({ isAdmin: false });

    res.render("admin-user", { users: userlist });
  } catch (err) {
    console.log(err);
  }
};

const blockUser = async (req, res) => {
  

  try {
    const id = req.query.id;
  
    const userData = await userModel.findById({ _id: id });
  
    if (userData.isVerified === true) {
      await userModel.findByIdAndUpdate(
        { _id: id },
        { $set: { isVerified: false } }
      );
  
    } else {
      await userModel.findByIdAndUpdate(
        { _id: id },
        { $set: { isVerified: true } }
      );

    }
  
    res.redirect("/admin/userlist");
  
  } catch (err) {
    console.log(err);
  }
};

const verifyAdmin = async (req, res, next) => {
  const username = req.body.email;
  const password = req.body.password;

  const userdata = await userModel.findOne({ email: username });
  if (userdata.isAdmin === true) {
    if (userdata.password === password) {
      req.session.admin_id = userdata._id;
      req.session.admin = userdata.email;
      next();
    } else {
      res.render("admin-login",{message:'wrong passwrod'});
      // console.log("password error");
    }
  } else {
    res.render("admin-login",{message:'you are not a administrator'});
    // console.log("user not found");
  }
};

const isLogin = (req, res, next) => {
  if (req.session.admin) {
    next()
  } else {
    res.render("admin-login");
  }
};

const isLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
};
const loadProduct = async (req, res, next) => {
  try {
    const images = req.files;
    const product = new productModel({
      name: req.body.sname,
      category: req.body.scategory,
      price: req.body.sprice,
      description: req.body.sdescription,
      rating: req.body.srating,
      image: images.map((x) => x.filename),
    });
    await product.save().then(() => console.log("product saved"));

    next()
  } catch (error) {
    console.log(error.message);
  }
};

const displayProduct = async (req, res) => {
  try {
    const productlist = await productModel.find();

    res.render("admin-product", { product: productlist });
  } catch (err) {
    console.log(err);
  }
};

const dltProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const productData = await productModel.findOne({ _id: id });

    if (productData.isAvailable === true) {
      await productModel.findByIdAndUpdate(
        { _id: id },
        { $set: { isAvailable: false } }
      );
    } else {
      await productModel.findByIdAndUpdate(
        { _id: id },
        { $set: { isAvailable: true } }
      );
    }

    res.redirect("/admin/product");
  } catch (err) {
    console.log(err);
  }
};

const getEdit = async (req, res) => {
  try {
    const id = req.query.id;

    const Sproduct = await productModel.findById({ _id: id });
    console.log(Sproduct);
    if (Sproduct) {
      res.render("edit-product", { product: Sproduct });
    } else {
      res.redirect("/admin/product");
    }
  } catch (err) {
    console.log(err);
  }
};         

const editProduct = async (req, res) => {
  try {
    const id = req.body.id
  const name = req.body.name
  const price = req.body.sprice
  const description= req.body.sdescription
  const rating= req.body.srating
  const category= req.body.scategory
  const images = req.files
  const image= images.map((x) => x.filename)


  if(image.length == 0)
  {
    await productModel.updateOne({_id:id},{
      $set:{
        name:name,
        price:price,
        description:description,
        rating:rating,    
        category:category,

      }
    })
  }
  else
  {
    await productModel.updateOne({_id:id},{
      $set:{
        name:name,
        price:price,
        description:description,
        rating:rating,
        category:category,
        image:image
      }
    })

  }


    res.redirect("/admin/product");
  } catch (err) {
    console.log(err);
  }
};

const loadCategory = async(req,res)=>{
  try{
    const categoryData = await categorySchema.find()
    res.render('admin-category',{category:categoryData})
  }
  catch(err){
    console.log(err)
  }
}

const unlistCategory = async (req,res)=>{
  try{
    const id = req.query.id
    await categorySchema.updateOne({_id:id},{$set:{isAvailable:0}})
    res.redirect('/admin/adminCategory')
  }
  catch(err)
  {                                                         
    console.log(err)
  }
} 

const listCategory = async (req,res)=>{
  try{

    const id = req.query.id
    await categorySchema.updateOne({_id:id},{$set:{isAvailable:1}})
    res.redirect('/admin/adminCategory')
  }
  catch(err){
    console.log(err)
  }
}

const addCategory = async (req,res)=>{
  try{
    // const categoryName = req.body.category
    const categoryData = await categorySchema.findOne({name:req.body.category})
    if(categoryData){
      res.redirect('/admin/adminCategory')

    }
    else
    {
      const category = categorySchema({name:req.body.category})
      await category.save()
      res.redirect('/admin/adminCategory')
    }
   

  }  
  catch(err){
    console.log(err)
  }
}



const loadOrderList = async (req,res)=>{
  try{
    const orderData = await orderModel.find().sort({createdAt:-1})
    const productData = await productModel.find()
    const userData = await userModel.find({is_admin:false})
    for (let key of orderData){
      await key.populate('products.item.productId')
      await key.populate('userId')
    }
    console.log(orderData)
    const id = req.query.id
  if(id)
  {
    res.render('admin-orderlist',{order:orderData,id,product:productData,users:userData})
  }
  else
  {
    res.render('admin-orderlist',{order:orderData,id:'ALL',product:productData,users:userData})

  }
        

  }
  catch(err)
  {
    console.log(err)
  }
}


const deliveredOrder = async(req,res)=>{
  try{

    const id = req.query.id;
    await orderModel.findByIdAndUpdate({_id:id},{$set:{status:'Delivered'}})
    res.redirect('/admin/loadOrder')

  }
  catch(err)
  {
    console.log(err)
  }
}

const confirmOrder = async(req,res)=>{
  try{
    const id = req.query.id
    await orderModel.findByIdAndUpdate({_id:id},{$set:{status:'Confirmed'}})
    res.redirect('/admin/loadOrder')
  }
  catch(err)
  {
    console.log(err)
  }
}

const returnOrder = async (req,res)=>{
  try{
    const id = req.query.id
    await orderModel.findByIdAndUpdate({_id:id},{$set:{status:'Returned'}})
    res.redirect('/admin/loadOrder')

  }
  catch(err){
    console.log(err)
  }
}

const cancelOrder = async(req,res)=>{
  try{
    const id = req.query.id;
    await orderModel.findByIdAndUpdate({_id:id},{$set:{status:'Canceled'}})
    res.redirect('/admin/loadOrder')
  }
  catch(err)
  {
    console.log(err)
  }
}

const orderDetail = async(req,res)=>{
  try{

    const id = req.query.id
    // const userData = await userModel.find()
    const order = await orderModel.findById({_id:id})
    const completeOrder = await order.populate('products.item.productId')
    // const user = await order.populate('userId')
    const userData = await userModel.find({_id:completeOrder.userId})
    // console.log(userData)
    res.render('admin-viewOrder',{order:completeOrder,users:userData,id:completeOrder.userId,user:userData})
  }
  catch(err)
  {
    console.log(err)
  }
}

const CancelReqst = async (req,res)=>{
  try{
    const id = req.query.id;
    await orderModel.findByIdAndUpdate({_id:id},{$set:{status:"Return Request Canceled"}})
    res.redirect('/admin/loadOrder')

  }
  catch(err)
  {
    console.log(err)
  }
}

const salesReport = async (req,res)=>{
  try{
    const orderData = await orderModel.find().sort({createdAt:-1})
    const productData = await productModel.find()
    const userData = await userModel.find({is_admin:false})
    for (let key of orderData){
      await key.populate('products.item.productId')
      await key.populate('userId')
    }
    res.render('sales-Report',{order:orderData,product:productData,users:userData})

  }
  catch(err)
  {
    console.log(err)
  }
}

const datewiseReport = async(req,res)=>{
  try{

    const sales = await orderModel.find({ $and: [
      { createdAt: { $gte: req.body.Startingdate } },
      {createdAt: { $lte: req.body.Endingdate } },
      { status: "Delivered" }
    ]})
    // const productData = await productModel.find()
    // const userData = await userModel.find({is_admin:false})
    for (let key of sales){
      await key.populate('products.item.productId')
      await key.populate('userId')
    }

    res.render('datewiseReport',{order:sales})


  }
  catch(err)
  {
    console.log(err)
  }
}


const loadBanner = async (req,res)=>{
  try{
    const bannerData = await bannerModel.find()

    res.render('admin-banner',{banner:bannerData})

  }
  catch(err)
  {
    console.log(err)
  }
}

const loadAddBanner = (req,res)=>{
  try{
    res.render('add-banner')

  }
  catch(err)
  {
    console.log(err)
  }
}

const addBanner = async(req,res)=>{
  try{
  //    const des = req.body.description
     const images = req.files

  const banner = await new bannerModel({
    description:req.body.description,
    image:images.map((x)=>x.filename)
    
  
  })
  await banner.save().then(()=>console.log('banner Saved'))
  res.redirect('/admin/loadBanner')

  }
  catch(err)
  {
    console.log(err)
  }
}

const unlist = async (req,res)=>{
  try{
    console.log('1')
    await bannerModel.findByIdAndUpdate({_id:req.query.id},{$set:{isAvailable:false}})
    console.log('2')
    res.redirect('/admin/loadBanner')

  }
  catch(err)
  {
    console.log(err)
  }
}

const list = async (req,res)=>{
  try{
    console.log('1')
    await bannerModel.findByIdAndUpdate({_id:req.query.id},{$set:{isAvailable:true}})
    console.log('2')
    res.redirect('/admin/loadBanner')

  }
  catch(err)
  {
    console.log(err)
  }
}

module.exports = {
  getAdmin,
  adminLogin,
  verifyAdmin,
  isLogin,
  isLogout,
  loadadminUser,
  blockUser,
  loadProduct,
  displayProduct,
  addProduct,
  dltProduct,
  getEdit,
  editProduct,
  loadCategory,
  unlistCategory,
  listCategory,
  addCategory,
  loadOrderList,
  deliveredOrder,
  confirmOrder,
  returnOrder,
  cancelOrder,
  orderDetail,
  CancelReqst,
  salesReport,
  datewiseReport,
  loadBanner,
  loadAddBanner,
  addBanner,
  unlist,
  list
};
