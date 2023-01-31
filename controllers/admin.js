const bcrypt=require('bcrypt')
const User=require('../models/User');
const jwt=require('jsonwebtoken');
const { DATEONLY } = require('sequelize');
const uuid=require('uuid');
const Expense=require('../models/Expenses');




exports.GetPremiumDetails=(req,res,next)=>{
    
    const UserId=req.body.token;
    console.log('This is User Id-->'+UserId);
    const DecyptJWT=jwt.verify(UserId,process.env.TOKEN_SECRET);
    User.findByPk(DecyptJWT).then(response=>{
        res.json(response);
    })
}


exports.PostSignUp=(req,res,next)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
   
    console.log(name+"--"+email);
    const d= new Date();
    console.log(d);



    User.findOne({where:{email:email}}).
    then(response=>{
        if(response===null){
            bcrypt.hash(password,10)
            .then(hash=>{
                User.create({name:name,email:email,password:hash,premium:false,validTill:d}).
                then(response=>{
                    res.json(response)
                }).catch(err=>console.log('err'))
                
        
            })
           
        }
        if(response!=null){
            res.json('Already Exists')
        }
    })
   
}

exports.GetSignedUpUserDetails=(req,res,next)=>{
    User.findAll().
    then(response=>{
        console.log(response)
    }).catch(err=>{
        console.log(err);
    })
}

exports.PostLogin=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    console.log(email+"" +password)
    const g=uuid.v4();
    console.log(uuid)
    console.log("this is uuid-->"+g);


    User.findOne({where:{email:email}}).
    then(response=>{
        console.log("login res")
        
        console.log(response);


        if(response===null){
            res.send('new')

        }
        else{
            bcrypt.compare(password,response.password)
            .then(result=>{
                console.log(result);
                if(result===true){
                    
                    // let s=response.id.toString();
                    
                    // bcrypt.hash(s,10)
                    // .then(hash=>{
                    //     console.log(hash)
                    const Id=generateToken(response.id);
                    console.log( "this is the JSW TOLEN-->"+Id);
                        res.json({message:'login',UserId:Id,premium:response.premium});

                    // })
                        //  res.json({message:'login',UserId:response.id})

                }
                // if(response.password===password){
                
                
                else{
                    res.send('not')
                }

            })

          

        }

      
    })

}

function generateToken(id){
    return jwt.sign(id,process.env.TOKEN_SECRET)
}

exports.getleaderBoardExpenses=async(req,res,next)=>{

    User.findAll({
        attributes:['id','name']
    }).then(async (users)=>{
        var UserAndExpense=[]
    var alldata={};
    for(let i=0;i<users.length;i++){
    await  Expense.findAll({where:{userId:users[i].id}}).then(expense=>{
          var totalexpense=0;
          for(let i=0;i<expense.length;i++){
            totalexpense=totalexpense+expense[i].expenseAmount
    
          }
            alldata={
              ...users[i].dataValues,
              
              totalexpense
            }
            console.log(alldata);
          })
          UserAndExpense.push(( alldata));
          console.log("inside expenses")
          console.log(UserAndExpense)
          
          
    
        }
        console.log("this is user expenses")
        console.log(UserAndExpense);
        res.json(UserAndExpense)
        
    
        // res.json(( alldata))
    

   // res.json(users);

    })

}













