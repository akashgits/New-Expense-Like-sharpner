const Expense=require('../models/Expenses');
const Secrete_Key=require('./admin');
const Jwt=require('jsonwebtoken')
const Sequelize=require('sequelize');

let items_per_page=3;
let page=1;
let Track_items_per_page=5;
let Track_page=1;

exports.PostExpenses=(req,res,next)=>{
    const expenseAmount=req.body.expenseAmount;
    const description=req.body.description;
    const category=req.body.category;
    const UserId=req.body.UserId;

    console.log("-->"+expenseAmount+'ok'+description+''+UserId);
    const DecyptJWT=Jwt.verify(UserId,process.env.TOKEN_SECRET);
    console.log("for Post expense->"+DecyptJWT);
    var g=new Date();
    let c=g.getDate();
    let d=g.getFullYear();
    let e=g.getMonth();
    let today=`${d}-${e}-${c}`

    
    Expense.create({
        userId:DecyptJWT,
        expenseAmount:expenseAmount,
        description:description,
        category:category,
        addedAt:g


        
    }).then(response=>{
        res.send(response);
    })
    }




    

    exports.GetExpense=(req,res,next)=>{
        const UserId=req.body.UserId;
        if(req.query.page!=undefined){
            page=parseInt(req.query.page);

        }
        if(req.query.items!=undefined){
            items_per_page=parseInt(req.query.items);
        }
         
        console.log('this is query'+page);
        console.log(page);
        console.log(items_per_page);
        console.log("this is the expense userId"+UserId)
        const DecyptJWT=Jwt.verify(UserId,process.env.TOKEN_SECRET);
        console.log("<---->"+DecyptJWT);
        


  
        Expense.findAndCountAll({where:{UserId:DecyptJWT}})
        .then(totalExpenses=>{
            totalItems=totalExpenses;

            // console.log(response);
            Expense.findAll({limit:items_per_page,offset:((page-1)* items_per_page),where:{UserId:DecyptJWT},order:[['createdAt','DESC']]})
            .then(respon=>{

                res.status(200).json({respon,
                      totalpages:Math.ceil(totalItems.count/items_per_page)
                    //totalpages:totalItems.count/items_per_page
                });
            })
         })  

       
        
    }



    exports.DeleteExpense=(req,res,next)=>{
        const id=req.body.id;
        Expense.destroy({where:{id:id}}).then(response=>{
            res.json(response)

        })
    }

    exports.GetFromToExpenses=(req,res,next)=>{
        if(req.query.page!=undefined){
            Track_page=parseInt(req.query.page);

        }
        if(req.query.items!=undefined){
            Track_items_per_page=parseInt(req.query.items);
        }

        const {From}=req.body;
        const {To}=req.body;
        const {id}=req.body;
        const DecyptJWT=Jwt.verify(id,process.env.TOKEN_SECRET);

       // console.log(From+""+To+""+DecyptJWT);
        // let mm=`${From}`;
        // let kk=`${To}`;
       // console.log(mm+"---->"+kk);
        Expense.findAll({where:{userId:DecyptJWT}}).then(k=>{
            const Op=Sequelize.Op;
            Expense.findAndCountAll({where:{userId:DecyptJWT,addedAt:{[Op.between]:[From,To]}}}).then(TrackTotalItems=>{
               // console.log(TrackTotalItems);


                Expense.findAll({limit:Track_items_per_page,offset:((Track_page-1)* Track_items_per_page),where:{userId:DecyptJWT,addedAt:{[Op.between]:[From,To]}}}).then(response=>{
                console.log("this is the original response")
               // console.log(response)
                res.status(200).json({response,totalPages:Math.ceil(TrackTotalItems.count/Track_items_per_page)});
            })
        })
            

        })

        

    }

   