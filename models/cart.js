module.exports=function cart(oldCart){
    //this or operator is in btw zero and object 
    //if ist value is null or undefined assign 2nd value
    this.items=oldCart.items || {} 
    this.totalQty=oldCart.totalQty || 0
    this.totalPrice=oldCart.totalPrice || 0

    this.add=function(item,id){
        var storedItem=this.items[id]
        if(!storedItem){
            storedItem=this.items[id]={item:item,qty:0,price:0}
        }
        storedItem.qty++
        storedItem.price=item.price*storedItem.qty
        this.totalQty++
        this.totalPrice+=storedItem.price
    }
    this.generateArray=function(){
        var arr=[]
        for(var id in this.items){
            arr.push(this.items[id])
        }
        console.log(arr)
        return arr
    }
    this.reduceByOne=function(id){
        this.items[id].qty--;
        this.items[id].price-=this.items[id].item.price
        this.totalQty--;
        this.totalPrice-=this.items[id].item.price
        if(this.items[id].qty <= 0){
            delete this.items[id]
        }
    }
    this.removeAll=function(id){
        this.totalQty-=this.items[id].qty
        this.totalPrice-=this.items[id].price
        delete this.items[id]
    }
}