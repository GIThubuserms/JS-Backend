import mongoose, { Schema } from "mongoose";
import { User } from "./user.model";

const subscriptionSchema = new Schema({
    subscriber: {   //i am subscribing to whom
        type:Schema.Types.ObjectId,
        ref: "User",
    },
     channel: {  // if someone subscribe me then came here
        type:Schema.Types.ObjectId,
        ref: "User",
    } 


}, { timestamps: true })

 export const Subscription=mongoose.model("Subscription",subscriptionSchema) 