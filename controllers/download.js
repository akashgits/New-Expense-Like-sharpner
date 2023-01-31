const Expense=require('../models/Expenses');
const Jwt=require('jsonwebtoken')
const Sequelize=require('sequelize');
const UserServices=require('../services/userservices')
const S3Services  = require('../services/s3services');
const DownloadList=require('../models/DownloadList')

exports.postdownload=(req,res,next)=>{
    // const {From}=req.body;
    // const {To}=req.body;
    // const {token}=req.body;
   // const DecyptJWT=Jwt.verify(token,process.env.TOKEN_SECRET);
    // Expense.findAll({where:{userId:DecyptJWT}}).then(k=>{
      
        const From=req.from;
        const To=req.To;
        console.log(From+"---ok--"+To);

        // Expense.findAll({where:{userId:DecyptJWT,addedAt:{[Op.between]:[From,To]}}}).then(TrackTotalItems=>{
        req.user.downloadlist({where:{addedAt:{[Op.between]:[From,To]}}}).then(TrackTotalItems=>{
            console.log(TrackTotalItems);

          return  res.json(TrackTotalItems);



        })
        .catch(err=>{
            return res.status(402).json({error:err,sucsess:false})
        })

    // })

    
}



exports.downloadExpenses = async (req,res,next)=>{
    const token=req.body.token;
    const From=req.body.Main_From;
    const To=req.body.Main_To
    
    
   
        const DecyptJWT=Jwt.verify(token,process.env.TOKEN_SECRET);
        const Op=Sequelize.Op;
           Expense.findAll({where:{userId:DecyptJWT,addedAt:{[Op.between]:[From,To]}}}).then( (TrackTotalItems)=>{
            const stringExpenses = JSON.stringify(TrackTotalItems);
            //const userId = req.user.id;
            console.log(';this is stringify');
            console.log(stringExpenses);
            const filename = `expense${DecyptJWT}/${new Date}.txt`;//filename should be unique evry time we upload file
              S3Services.uploadFiletoS3(stringExpenses, filename)
              .then(async fileUrl=>{

                 console.log(fileUrl);
                
                  
                   await DownloadList.create({url:fileUrl,userId:DecyptJWT})
                    .then(urlresp=>{
                        console.log('urlresp');
                        console.log(urlresp);
                        res.status(200).json({fileUrl, success:true});
                    })
              })
          })
}

exports.loaddownloadlist=(req,res,next)=>{
    const token=req.body.token;
    console.log('this is token');
    console.log(token)
    const DecyptJWT=Jwt.verify(token,process.env.TOKEN_SECRET);
    DownloadList.findAll()
    .then(response=>{
        console.log("rrrrr")
        console.log(response);
        res.json(response)
    })
}











// exports.downloadExpenses = async (req,res,next)=>{
//     try {
//         const expenses = await UserServices.userExpenses(req);
//         // console.log(expenses);
//         const stringExpenses = JSON.stringify(expenses);
//          const userId = req.user.id;
//     //     const filename = `expense${userId}/${new Date}.txt`;//filename should be unique evry time we upload file
//     //     const fileUrl  = await S3Services.uploadFiletoS3(stringExpenses, filename);
//     //     console.log(fileUrl)
//     //     res.status(200).json({fileUrl, success:true})
//     // } catch (error) {
//     //     res.status(500).json({fileUrl:'', success:false, error:error})
        
//     // }

//     console.log(stringExpenses);
//     console.log(userId);

//     res.json(stringExpenses);
// }
// catch(err){
//     res.json("this is error");
// }

// }


