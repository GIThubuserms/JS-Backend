import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'


cloudinary.config({
    cloud_name:"dsnne18o3",
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY
 })
 

  const Cloudnairy_Uplaod=async(url)=>{
   try{
      if(!url) return Error("Please Provide Url/Path")
    const cloudinaryFile=  await cloudinary.uploader.upload(url,{resource_type:"auto"})
    
      console.log("File Uploaded Successfully");
      
     return cloudinaryFile

   } catch (error) {
     
      fs.unlinkSync(url) // remove the locally save temporary file as the upload operation got failed
   }
  }

  
  export {Cloudnairy_Uplaod}

