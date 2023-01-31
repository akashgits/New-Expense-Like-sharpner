const bcrypt=require('bcrypt')
const User=require('../models/User');
const jwt=require('jsonwebtoken');
const sgmail=require('@sendgrid/mail');
const { where } = require('sequelize');
const uuid=require('uuid');
const forgetPassword=require('../models/forgetPassword')

exports.VerifyEmail=(req,res,next)=>{
    const email=req.body.email;

    console.log("this is the email"+email);
    User.findOne({where:{email:email}}).then(response=>{
        console.log(response);
        if(response===null){
            console.log('not found')
            res.json('notFound')


        }
        else{
            const g=uuid.v4();
            forgetPassword.create({id:g,active:false,userId:response.id}).then(respons=>{
                console.log(respons);

                res.json(respons);

            })


            
           // res.json({id:response.id,uid:g})
            



            // sgmail.setApiKey('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');
            // const msg={
            //     to:'akashpatthi2000@gmail.com',
            //     from:'akashbablu771@gmail.com',
            //     subject:'change the password',
            //     text:'you can do it now',
            //     html: `<a href="http://localhost:4444/password/resetpassword">Reset password</a>`,
            // }
            // sgmail.send(msg).then(respon=>{
            //     console.log(respon);
            //     console.log("this is sendgrid resp");

               

            // }).catch(err=>{
            //     console.log(err);
            // })
            

        }
        
    })

}

exports.UpdatePasword=(req,res,next)=>{
    
   const id=req.body.id;
   const password=req.body.password;

    console.log(password+"lkkkk"+id);

    forgetPassword.findByPk(id).then(response=>{
        console.log(response.active);
        if(response.active===false){
            bcrypt.hash(password,10).then(hash=>{

                User.update({password:hash},{where:{id:response.userId}}).then(us=>{
                    console.log(us);
                    
                    forgetPassword.update({active:true},{where:{id:id}}).then(con=>{
                        res.json(us);

                    })
                })
        
        
            })

        }
        else{
            res.json('oops')
        }

    })


 


}