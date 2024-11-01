import { asyncHandler } from "../utils/Asynchandler.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";


export const verifyuser=asyncHandler(async(req,_,next)=>{
  try {
     // In this we ensure that user is verify by taking toke from it cokkies data and checking from our env  if match then hit db call for the decodetoken._id
     // the current logged in user came 
  
      // we are getting token from cokies which we add while login the user req.cookie
      const token=req.cookies?.accessToken || req.header('Authentication')?.replace("Bearer ","") 
      if(!token) throw new ApiError(401,"UnAuthorized User !!")
      console.log("TOKEN : "+token);
      
      const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
      if(!decodedtoken) throw new ApiError(402,"User is Not Authorized !!")
      console.log("DECODED TOKEN : "+decodedtoken);
  
      const verifiedUser=await User.findById(decodedtoken?._id).select('-password -refreshToken')
      if(!verifiedUser) throw new ApiError(404,"User Not found !!")
      console.log(verifiedUser);
  
      req.user=verifiedUser
      next()
  } catch (error) {
 throw new ApiError(404,"Invalid Access Token")
})