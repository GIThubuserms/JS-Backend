import mongoose from "mongoose";
import { Schema } from "mongoose";


const PlaylistSchema=new mongoose.Schema({  
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    vedios:[
    {
        type:Schema.Types.ObjectId,
        ref:"Vedio"
    }
    ],
    owner:{
       type:Schema.Types.ObjectId,
       ref:"User"
    }

},{timestamps:true})


export const Playlist=mongoose.model("Playlist",PlaylistSchema)