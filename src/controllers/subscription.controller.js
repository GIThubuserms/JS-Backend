import ApiResponse from "../utils/Apiresponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";
import {User} from '../models/user.model.js'

export const ToggleSubscription=asyncHandler(async(req,res)=>{
    const {ChannelName}=req.params
    const userId=req.user._id

    // console.log("Testing 123");
    // console.log("ChannelName :"+ChannelName);
    // console.log("UserId :"+userId);
    
   //Channel Name and Username are refer to be same that why i am searching username is that username/channel exist 
    const UserChannel=await User.findOne({
        username:ChannelName.toString()
    }).select("username")

    // console.log("Testing 345");
    // console.log("UserChannel Comming From db :" +UserChannel);
    

    if(!UserChannel) throw new ApiError(402,"Channel doesnot Exists !!")
     
    const IsUserSubscribed=await Subscription.aggregate([
        {
            $match:{
              channel:new mongoose.Types.ObjectId(UserChannel._id),  
              subscriber:new mongoose.Types.ObjectId(userId) 
            }
        },
    ])   
    
    // console.log("Testing 567");
    // console.log("Type   : "+ typeof(IsUserSubscribed));
    // console.log(IsUserSubscribed.length);
    // console.log("Is UserSubscribed  : "+IsUserSubscribed);
    

    if(IsUserSubscribed.length){
        const UnsubscribeFunctionality=await Subscription.findOneAndDelete({
            channel:UserChannel._id,  
            subscriber:userId 
        })
        if(!UnsubscribeFunctionality) throw new ApiError(402,"Error while Unsubscribing")
           return res.status(200).json(new ApiResponse(200,{},"User UnSubscribed Successfully "))  
        }
        console.log("Testing 678");

    if(!IsUserSubscribed.length){
            const SubscribeFunctionality=await Subscription.create({
                channel:UserChannel._id,  
                subscriber:userId 
            })
            if(!SubscribeFunctionality) throw new ApiError(402,"Error while Subscribing")      
           return res.status(200).json(new ApiResponse(200,{},"User Subscribed Successfully "))  
            }
            console.log("Testing 789");


})

export const TotalSubscribers=asyncHandler(async(req,res)=>{
    const {ChannelName}=req.params
    const userId=await User.findOne({username:ChannelName}).select('_id')
    // My channel name is CAC and i want to calculate total subs
    const TotalSubs=await Subscription.aggregate([
        {
            $match:{
            "channel":new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $count:"TotalSubscribers"
        }
    ])
    if(!TotalSubs.lenght<0) throw new ApiError(400,"Error while loading subscribers !!")
    res.status(200).json(new ApiResponse(200,TotalSubs[0]?.TotalSubscribers||0,"TotalSubscribers Fetched Successfully"))

})


export const SubscribedTo=asyncHandler(async(req,res)=>{
    const {ChannelName}=req.params
    const userId=await User.findOne({username:ChannelName}).select('_id')
    
    // My userid name is a and i want to calculate channel I subscribed
    const SubTo=await Subscription.aggregate([
        {
            $match:{
            "subscriber":new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $count:"SubscribedTo"
        }
    ])
    if(!SubTo.length<0) throw new ApiError(400,"Error while loading SubscribedTo !!")
    res.status(200).json(new ApiResponse(200,SubTo[0]?.SubscribedTo||0,"SubscribedTo Fetched Successfully"))

})