const Expense=require('../models/Expenses');
const Secrete_Key=require('./admin');
const Jwt=require('jsonwebtoken')
const Sequelize=require('sequelize');


exports.PostExpenses=(req,res,next)=>{
    const expenseAmount=req.body.expenseAmount;
    const description=req.body.description;
    const category=req.body.category;
    const UserId=req.body.UserId;

    console.log("-->"+expenseAmount+'ok'+description+''+UserId);
    const DecyptJWT=Jwt.verify(UserId,Secrete_Key.Secrete_Key);
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
        console.log("this is the expense userId"+UserId)
        const DecyptJWT=Jwt.verify(UserId,Secrete_Key.Secrete_Key);
        console.log("<---->"+DecyptJWT);



        Expense.findAll({where:{UserId:DecyptJWT}}).
        then(response=>{
            console.log("THE oRIGINAL RESPONSE OF EXPENSE"+response)
            res.json(response);
        })
        
    }

    exports.DeleteExpense=(req,res,next)=>{
        const id=req.body.id;
        Expense.destroy({where:{id:id}}).then(response=>{
            res.json(response)

        })
    }

    exports.GetFromToExpenses=(req,res,next)=>{
        const {From}=req.body;
        const {To}=req.body;
        const {id}=req.body;
        const DecyptJWT=Jwt.verify(id,Secrete_Key.Secrete_Key);

        console.log(From+""+To+""+DecyptJWT);
        // let mm=`${From}`;
        // let kk=`${To}`;
       // console.log(mm+"---->"+kk);
        Expense.findAll({where:{userId:DecyptJWT}}).then(k=>{
            const Op=Sequelize.Op;
            Expense.findAll({where:{userId:DecyptJWT,addedAt:{[Op.between]:[From,To]}}}).then(response=>{
                console.log("this is the original response")
                console.log(response)
                res.json(response);
            })
            

        })

        

    }