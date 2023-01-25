
const userModel = require('../models/userModel')
const productModel = require('../models/productModel')
const multer = require('multer')
const path = require('path')

// let Storage = multer.diskStorage({
//     destination:"./public/admin/assets/uploads/",
//     filename:(req,file,cb)=>{
//         cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
//     }
// })
// let upload = multer({
//     storage:Storage
// }).single('simage')



const adminLogin = (req,res)=>{
    res.render('admin-login')
}

const getAdmin =(req,res)=>{
    res.render('admin-page')
}



const addProduct = (req,res)=>{
    res.render('add-product')
}

const loadadminUser = async (req,res)=>{
    try { 
    const userlist = await userModel.find({isAdmin:false})
    
        res.render('admin-user',{users:userlist})
        

}
catch(err){
    console.log(err)
}
   
}

const blockUser = async (req,res)=>{
    console.log('1')

    try {
        const id = req.query.id
        console.log('2')
        const userData = await userModel.findById({_id:id})
        console.log('3')
        if(userData.isVerified === true)
        {
           await userModel.findByIdAndUpdate({_id:id},{$set:{isVerified:false}})
           console.log('4')
        }
        else
        {
            await userModel.findByIdAndUpdate({_id:id},{$set:{isVerified:true}})
            console.log('5')
        }
        console.log('6')
        res.redirect('/admin/userlist')
        console.log('success')
    }catch(err){
        console.log(err)
    }
}



const verifyAdmin = async (req,res,next)=>{

    const username=req.body.email
    const password= req.body.password


    const userdata = await userModel.findOne({email:username})
    if(userdata.isAdmin === true){
     if(userdata.password === password){

        req.session.admin_id = userdata._id
        req.session.admin = userdata.email
        next()
    }
     else{
        res.redirect('/admin')
        console.log('password error')
        
    }

}
else
{
    res.redirect('/admin')
    console.log('user not found')

}
   
}


const isLogin = (req,res,next)=>{
if(req.session.admin){
    res.render('admin-page')


}
else
{
    next()

}

}

const isLogout = (req,res)=>{
    req.session.destroy()
    res.redirect('/admin')
}
const loadProduct = async (req,res,next)=>{



    try {
        const images = req.files;
        const product = new productModel({
            name:req.body.sname,
            category:req.body.scategory,
            price:req.body.sprice,
            description:req.body.sdescription,
            rating:req.body.srating,
            image:images.map((x)=>x.filename)
          

        })
        await product.save().then(()=>console.log("product saved"))

        next()

    } catch (error) {
        console.log(error.message)
        
    }
}


const displayProduct = async (req,res)=>{

    try{

        const productlist = await productModel.find()
       
        res.render('admin-product',{product:productlist})
        

    }
    catch(err){
        console.log(err)
    }
}


 const dltProduct = async (req,res)=>{
    try{

        const id = req.query.id
        const productData = await productModel.findOne({_id:id})

        if(productData.isAvailable === true)
        {
            await productModel.findByIdAndUpdate({_id:id},{$set:{isAvailable:false}})
        }
        else
        {
            await productModel.findByIdAndUpdate({_id:id},{$set:{isAvailable:true}})
        }

        res.redirect('/admin/product')

    }
    catch(err){
        console.log(err)
    }
 }

const getEdit = async (req,res)=>{
try{
    const id = req.query.id
   
    const Sproduct= await productModel.findById({_id:id})
    console.log(Sproduct)
    if(Sproduct)
    {
        res.render('edit-product',{ product: Sproduct })
    }
    else
    {
        res.redirect('/admin/product')
    }
}
catch(err){
    console.log(err)
}

}

const editProduct = async (req,res)=>{

    try{
          console.log(req.body.id)
        await productModel.findByIdAndUpdate({_id:req.body.id},{
            $set:{
                name:req.body.name,
                price:req.body.sprice,
                description:req.body.sdescription,
                rating:req.body.srating,
                category:req.body.scategory,
                image:req.body.sname 
            }
        })

        res.redirect('/admin/product')


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
    editProduct

        
}