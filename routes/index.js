var express = require('express');
var router = express.Router();
var Product = require('../models/product')
var Order=require('../models/order')
var Cart=require('../models/cart') 


/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg=req.flash('success')[0]
  var products=Product.find(function(err,docs){
    if(err){
      return console.error(err)
    }
    if(docs.length>=1){
      var productChunks=[]
      var chunkSize=3
      for(var i=0;i<docs.length;i+=chunkSize){
        productChunks.push(docs.slice(i,i+chunkSize))
      }
      res.render('shop/index', { title: 'Shopping cart' ,products:productChunks,successMsg:successMsg,noMessage:!successMsg});
    }
  })
});
router.get('/add-to-cart/:id',isLoggedIn,function(req,res,next){
  var productId=req.params.id;
  var cart=new Cart(req.session.cart ? req.session.cart :{})
  Product.findById(productId,function(err,product){
    if(err){
      return console.error(err)
      //return res.redirect('/')
    }
    cart.add(product,product.id)
    req.session.cart=cart
    console.log(req.session.cart)
    res.redirect('/')
  })
})

router.get('/shopping-cart',isLoggedIn,function(req,res,next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart',{products:null})
  }
  var cart=new Cart(req.session.cart)
  res.render('shop/shopping-cart',{products:cart.generateArray(),totalPrice:cart.totalPrice})
})

router.get('/reduce/:id',function(req,res,next){
  var productId=req.params.id
  var cart=new Cart(req.session.cart)
  cart.reduceByOne(productId)
  req.session.cart=cart
  res.redirect('/shopping-cart')
})

router.get('/remove/:id',function(req,res,next){
  var productId=req.params.id
  var cart=new Cart(req.session.cart)
  cart.removeAll(productId)
  req.session.cart=cart
  res.redirect('/shopping-cart')
})

router.get('/checkout',isLoggedIn,function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart')
  }
  var cart=new Cart(req.session.cart)
  var errMsg=req.flash('error')[0]
  res.render('shop/checkout',{total:cart.totalPrice,errMsg:errMsg,noError:!errMsg})
})
router.post('/checkout',isLoggedIn,function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart')
  }
  var cart=new Cart(req.session.cart)
  var stripe = require("stripe")("sk_test_3zFrHz7k1Qk4XG7PMZUARrLj")
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: "tok_mastercard", // obtained with Stripe.js
    description: "Test charge"
  }, function(err, charge) {
    // asynchronously called
    if(err){
      req.flash('error',err.message)
      return res.redirect('/checkout')
    }
    var order =new Order({
      //can access user on req object by help of passport
      user:req.user,
      cart:cart,
      address:req.body.address,
      name:req.body.name,
      paymentId:charge.id
    })
    order.save(function(err,result){
      if(err){
        console.log(err)
        res.redirect('/')
      }
      req.flash('success','Successfully bought product')
      req.session.cart=null
      res.redirect('/')
    })
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      //next means continue
      return next()
  }
  req.session.oldUrl=req.url
  res.redirect('/user/signin')
}
module.exports = router;
