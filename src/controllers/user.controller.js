import {asyncHandler} from '../utils/Asynchandler.js'

export const RegisterUser=asyncHandler(async(req,res)=>{
    res.status(200).json({
        message:"User Registered Successfully !!"
    })
})

