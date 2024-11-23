import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

cloudinary.config({
  cloud_name: "dsnne18o3",
  api_key:154578853975938,
  api_secret:"rOQgeA30XPKFsIPUQBFLwB_23yo"
});

const Cloudnairy_Uplaod = async (url) => {
  //console.log("INSIDE CLOUDINARY "+ url);
  try {
    if (!url) return Error("Please Provide Url/Path");
    const cloudinaryFile = await cloudinary.uploader.upload(url, {
      resource_type: "auto",
    });

     if(cloudinaryFile) fs.unlinkSync(url);
    // console.log("File Uploaded Successfully");
    // console.log("CLOUDINARY URL : " + cloudinaryFile.url );
    
    return cloudinaryFile;
  } catch (error) {
    console.log("FILE UPLOAD FAILED :"+error);
     fs.unlinkSync(url); //remove the locally save temporary file as the upload operation got failed
  }
};

export { Cloudnairy_Uplaod };
