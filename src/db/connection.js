import mongoose from "mongoose";
import {DB_Name} from "../constants.js"

export default async function databaseConnection(){
try {
  const connectionINSTANCE= await mongoose.connect(`${process.env.MONGODB}${DB_Name}`)
   // console.log('\n DB mongo connected');
   //console.log('\n Mongo db connection ',connectionINSTANCE);
   //console.log('\n Mongo db connection ',connectionINSTANCE.connection);
    console.log('\n Mongo db connection ',connectionINSTANCE.connection.host);
    
} catch (error) {
    console.log("Connection Error with database :-",error );
    //throw(error)
    process.exit(1)
}}
