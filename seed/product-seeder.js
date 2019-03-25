var Product=require('../models/product')
var mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/shopping21',{useNewUrlParser:true}) 

var products=[
    new Product({
        imagePath:'images/eigth.png',
        title:'Object Oriented Javasript',
        description: 'English,Available(10)',
        price:1220
    }),
    new Product({
        imagePath:'images/five.jpg',
        title:'Javasript and Jquery',
        description: 'English,Available(10),Kindle Edition',
        price:2340
    }),
    new Product({
        imagePath:'images/four.jpg',
        title:'Javasript Programming',
        description: 'English,Available(2),Paperback',
        price:1293
    }),
    new Product({
        imagePath:'images/nine.jpg',
        title:'Complete Javasript',
        description: 'English,Available(21)',
        price:1290
    }),
    new Product({
        imagePath:'images/one.jpg',
        title:'Object Oriented Javasript',
        description: 'English,Available(10)',
        price:1590
    }),
    new Product({
        imagePath:'images/seven.jpg',
        title:'Object Oriented Javasript',
        description: 'Kindle Edition,English,Available(10)',
        price:2000
    })
]
var done=0; 
for(var i=0;i<products.length;i++){
    products[i].save(function(err,result){
        done++;
        if(done==products.length){
            exit()
        }
    })
}
function exit(){
    mongoose.disconnect();
}