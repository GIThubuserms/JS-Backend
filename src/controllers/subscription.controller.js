import ApiResponse from "../utils/Apiresponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";
import {User} from '../models/user.model.js'

export const ToggleSubscription=asyncHandler(async(req,res)=>{
    const {ChannelName}=req.params
    const userId=req.user._id

    const UserChannel=await User.findOne({
        username:ChannelName.toString()
    })
    if(!UserChannel) throw new ApiError(402,"Channel doesnot Exists !!")
     
    const IsUserSubscribed=await Subscription.aggregate([
        {
            $match:{
              "channel":mongoose.Types.ObjectId(UserChannel._id),  
              "subscriber":new mongoose.Types.ObjectId(userId) 
            }
        }
    ])   
    
    if(IsUserSubscribed) 
    {
        const UnsubscribeFunctionality=await Subscription.findOneAndDelete({
            channel:UserChannel._id,  
            subscriber:userId 
        })
        
        if(!UnsubscribeFunctionality) throw new ApiError(402,"Error while Unsubscribing")
    
    }

    if(!IsUserSubscribed) 
        {
            const SubscribeFunctionality=await Subscription.create({
                channel:UserChannel._id,  
                subscriber:userId 
            })  
        }
        if(!IsUserSubscribed) throw new ApiError(402,"Error while Subscribing")

})

export const TotalSubscribers=asyncHandler(async(req,res)=>{
    const {userdId}=req.params
    // My channel name is CAC and i want to calculate total subs
    const TotalSubs=await Subscription.aggregate([
        {
            $match:{
            "channel":new mongoose.Types.ObjectId(userdId)
            }
        },
        {
            $count:"TotalSubscribers"
        }
    ])
    if(!TotalSubs) throw new ApiError(400,"Error while loading subscribers !!")
    console.log("TotalSubs : "+TotalSubs);
    res.status(200).json(new ApiResponse(200,TotalSubs,"TotalSubscribers Fetched Successfully"))

})


export const SubscribedTo=asyncHandler(async(req,res)=>{
    const {userdId}=req.params

    // My userid name is a and i want to calculate channel I subscribed
    const SubTo=await Subscription.aggregate([
        {
            $match:{
            "subscriber":new mongoose.Types.ObjectId(userdId)
            }
        },
        {
            $count:"SubscribersTo"
        }
    ])
    if(!SubTo) throw new ApiError(400,"Error while loading subscribedTo !!")
    console.log("SubsTo : "+SubTo);
    res.status(200).json(new ApiResponse(200,SubTo,"SubscribedTo Fetched Successfully"))



})