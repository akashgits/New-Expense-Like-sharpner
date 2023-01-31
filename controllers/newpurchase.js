const Order=require('../models/orders');
const Razorpay= require('razorpay');
const User=require('../models/User')

const purchasePremium=async(req,res,next)=>{
    try{
    let instanc= new Razorpay({
        key_id:"rzp_test_r5i695IXTvs36a",
        key_secret:"RYM1mDUhnL9Ex22iRjL9EMuV"
    })
    const amount=2500;

    instanc.orders.create({amount,currency:"INR"},(err, order)=>{
        if(err){
            throw new Error(err)
        }
        req.user.createOrder({orderid:order.id,status:"PENDING", }).then(()=>{
            console.log("this is the order"+order);
            return res.status(201).json({order,key_id:instanc.key_id})
        }).catch(err=>{
            throw new Error(err)
        })
        

    })

}
catch(err){
    console.log(err);
    res.status(403).json({ message: 'Sometghing went wrong', error: err})


}
}
const UpdateTransactionStatus=async(req,res)=>{
    try{
    const {payment_id, order_id}=req.body;
    Order.findOne({where:{orderid:order_id}}).then(order=>{
        order.update({paymentid:payment_id, status:'SUCCESFUL'}).then(()=>{
            req.user.update({premium:true})
            return res.status(202).json({sucess: true, message: "Transaction Successful"});
        })
        .catch((err)=> {
            throw new Error(err);
        })
    }).catch(err => {
        throw new Error(err);
    })
} catch (err) {
    console.log(err);
    res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })

}
}
module.exports={
    purchasePremium,UpdateTransactionStatus
}



    