import mongoose, { Schema } from "mongoose";

const LikeSchema=new Schema({
    comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    },
    vedio:{
       type:Schema.Types.ObjectId,
       ref:"Vedio" 
    },
    likedby:{
        type:Schema.Types.ObjectId,
        ref:"User" 
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:"Tweet" 
    }
},{timestamps:true})

export const Like=mongoose.model("Like",LikeSchema)