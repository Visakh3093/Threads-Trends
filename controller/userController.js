const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const categoryModel = require('../models/categoryModel')
const offerModel = require('../models/offerModel')


   

    getLogin= (req,res)=>{
        res.render('login')
    }

    getRegister= (req,res)=>{
        res.render('register')
    }

   
    userLogin=(req,res)=>{
        res.render('login')
    }

   

   

    addCart = async (req,res)=>{
        try{
            const cart = new cartModel({
                name:req.body.name
            })
        }
        catch(err)
        {
            console.log(err.message)
        }
         
        


    }


   
 const addUser = async (req,res,next)=>{

    const users = await new userModel({
        fname:req.body.fname,
        lname:req.body.lname,
        email:req.body.email,
        mobile:req.body.mobile,
        password:req.body.password,
        isAdmin:false,
        isVerified:true
    })

    users.save()
    next()
}

                                    
const verifyuser = async (req,res,next)=>{

        const userEmail = req.body.email
        const userPassword = req.body.password 

        const userData = await userModel.findOne({email:userEmail})
        if(userData){
            if(userData.isVerified === true){
            if(userData.password === userPassword){
                req.session.user_id = userData._id
                req.session.user = userData.email
                next()
            }
            else
            {
                console.log('password error')
                res.render('login',{message:'password error'})
            }
        }
        else{
        console.log('user blocked')
        res.render('login',{message:'user blocked'})
        }
    }
    else
    {
        console.log('user not found')
        res.render('login',{message:'user not found'})
    }
}


 getUserHome = (req,res)=>{
        res.render('userHome',{id:req.session.user_id})
    }

getShop = async (req,res)=>{
    try{

        const productData = await productModel.find()
      
        if(productData)
        {
            res.render('shop',{id:req.session.user_id,product:productData})
        }
        else
        {
            console.log('cant get')
        }
    

    }
    catch(err){
        console.log(err.message)
    }

}

const isLogin = (req,res,next)=>{ 
    if(req.session.user){
        res.render('userHome',{id:req.session.user_id})

    }
    else 
    { 
        next()
    }
}


const isLogout = (req,res,next)=>{
req.session.destroy()
    res.redirect('/')
}

const getCart = async (req,res,next)=>{
    try{
       if(req.session.user_id){
        const productData = await productModel.find()
        if(productData)
        {
            res.render('cart',{product:productData,id:req.session.user_id})

        }
    }
    else
    {
        next()
    }



        
    }
    catch(err)
    {
        console.log(err.message)
    }

    res.render('cart')

}




 

const singleProduct = async (req,res)=>{

    try{
        const id = req.query.id
        
        const productData = await productModel.find()
        const singleProduct = await productModel.findById({_id:id})
        console.log(singleProduct)
        
        if(singleProduct){
          
            res.render('singleProduct',{product:productData,single:singleProduct,id:req.session.user_id})

        }
        else
        {
            console.log('cant get single product')
        }

        

    }
    catch(err)
    {
        console.log(err.message)
    }
}

const getContact = (req,res,next)=>{
try{
    if(req.session.user_id)
    {
        res.render('contact')
    }
    else
    {
        next()
    }

}
catch(err)
{
    console.log(err.message)
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
        getCart,
        singleProduct,
        getContact

}