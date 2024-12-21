import { asyncHandler } from "../utils/Asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/Apiresponse.js";
import { Subscription } from "../models/subscription.model.js";
import { Vedio } from "../models/vedio.model.js";
import { Like } from "../models/likes.model.js";
import { TotalSubscribers } from "./subscription.controller.js";
import mongoose from "mongoose";



export const channelstats=asyncHandler(async(req,res)=>{
// show user,channel name ,subscribers,total likes 
const userId=req.user._id

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
if(!TotalSubs.lenght<0) throw new ApiError(400,"Error while loading Totalsubscribers !!")


const TotalViews=await Vedio.aggregate([
    {
      $match: {
        Owner:new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $project: {
        Views:1
      }
    },
    {
      $group: {
        _id: null,
        TotalViews: { $sum: "$Views" }
      }
    },
    {
      $project: {
        TotalViews:1,
        _id:0
      }
    },     
])
  if(!TotalViews.lenght<0) throw new ApiError(400,"Error while loading TotalViews !!")


const TotalLikes=await Like.aggregate([
    {
      $lookup: {
        from:"vedios",
        localField:"vedio",
        foreignField:"_id",
        as:"VedioOwner",
        pipeline:[
          {
          $project:{
            Owner:1
          }
        }
      ]
    }
    },
    {
      $addFields: {
        VedioOwner:{
          $arrayElemAt:["$VedioOwner",0]
        }
      }
    },
    {
      $match:{
        "VedioOwner.Owner":new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $count: 'TotalLikes'
    }
  ]
  )
if(TotalLikes.lenght<0) throw new ApiError(400,"Error while loading TotalLikes !!")
  
return res.status(200).json(new ApiResponse(200,{TotalSubs,TotalLikes,TotalViews},"Stats Fetched Successfully"))
})

export const vediosstats=asyncHandler(async(req,res)=>{
 const userId=req.user._id

 const VedioStats1=await Vedio.aggregate([
  {
    $lookup:{
      from:"users",
      foreignField:"_id",
      localField:"Owner",
      as:"Owner",
      pipeline:[
        {
          $project:{
            avatar:1,
            _id:1
          }
        }
      ]
    }
  },
  {
    $addFields:{
      Owner:{
        $first:"$Owner"
      }
    }
  },
  {$lookup: {
    from:"likes",
    localField:"_id",
    foreignField:"vedio",
    as:"likes",
    pipeline:[
      {
        $project:{
          _id:0,
          vedio:1
        }
      }
    ]
   }
  },
  {
    $addFields: {
      likes:{
        $size:"$likes"
      }
    }
  },
  {
    $match: {
      "Owner._id":new mongoose.Types.ObjectId(userId)
    }
  }
  ,{
    $project:{
      Title:1,
      Owner:1,
      isPublished:1,
      createdAt:1,
      likes:1
    }
  }
 ])
if(VedioStats1.length<0) throw new ApiError(400,'VedioStats Not Feched Properly')

res.status(200).json(new ApiResponse(200,{VedioStats1},"VedioStats Feched Successfully"))  
})