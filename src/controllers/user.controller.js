import { asyncHandler } from "../utils/Asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Cloudnairy_Uplaod } from "../utils/Fileupload.js";
import ApiResponse from "../utils/Apiresponse.js";
import jwt from 'jsonwebtoken'
import { set } from "mongoose";


const generateAccessANDRefreshToken = async (userId) => {
// This method do only 3 things 
// -> Find User by id  which already exists
// -> Generate Access AND Refersh Token
// -> update Refreshtoken and save user new obj bcz you add refresh token  

  try {
   const user=await User.findById(userId);

   const AccessToken=user.AccessToken()
   const RefreshToken=user.RefreshToken()

  // console.log("user Before Refresh Token",user);
  // console.log("ACCEES  TOKEN: ",AccessToken);
  // console.log("REFRESH TOKEN: ",RefreshToken);  
  // when we take the refresh and acces token we want to save in the user obj present in db
  // so first update existing one 
  // then save the existing one 

  // very imp point we only store refresh in db not access 
  user.refreshToken=RefreshToken
  
  user.save({ validateBeforeSave: false });

   return {AccessToken,RefreshToken} 
  
  } catch (error) {
    throw new ApiError(500, "Token Not genareated !!");
  }
};

export const RegisterUser = asyncHandler(async (req, res) => {
  // First take data from user from FORM,IMAGES,URL etc
  // validate the data emptychecks etc
  // check if user exist in db by email or username
  // validate the avatar is required
  // take the local storage file from multer and upload to cloudinary
  // craete a obj and create user in db
  // get user data from db exc ept password refreshtoken
  // check for user creation
  // response. send user data

  const { username, Fullname, email, password } = req.body;

  if (
    [username, Fullname, email, password].some((field) => {
      if (field === "") {
        throw new ApiError(400, "All field required !!");
      } else {
        null;
      }
    })
  );
  // to find something from mongodb we user .find .findone but
  // parameters are in form of operators like $or :[{},{},{}]  hence it will acts as an or logic if one is truye it will return it
  const existeduser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existeduser) {
    throw new ApiError(400, "User Already exists");
  }

  // Now for file  checking the req.body doesnot give us
  // when user uploads  middleware -> req.body -> req.files -> we extract
  console.log(req.files);
  
  const avatarlocalpath = req.files?.avatar?.[0]?.path;
  const coverimagelocalpath = req.files?.coverimage?.[0]?.path
  console.log(avatarlocalpath);
  console.log(coverimagelocalpath);

  if (!avatarlocalpath) {
    throw new ApiError(400, "Avatary File required");
  }

  const avatar=await Cloudnairy_Uplaod(avatarlocalpath);
  const coverimage=coverimagelocalpath && await Cloudnairy_Uplaod(coverimagelocalpath)

  if (!avatar) throw new ApiError(400, "Avatar Not upload on cloudinary");

  const newUser = await User.create({
    username,
    email,
    Fullname,
    password,
    avatar:avatar,
    coverimage: coverimage?.url || "",
  });
    
  if(!newUser) throw new ApiError(500,"User Not Formed")
  // ask from database the is user created
  const userverify = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  if (!userverify) throw new ApiError(500, "User not registred");

  return res
    .status(200)
    .json(new ApiResponse(200, userverify, "User registred succesfully"));
});

export const LoginUser = asyncHandler(async (req, res) => {
  /*
   take email and password 
   check it is not empty 
   search user by email or password
   user searched then access and refersh tokken
   cokkie create 
   send cokkie and json response
 */

  const {email, password, username } = req.body;
  
  

   if(!(email||password)){
    throw new ApiError(404,"Email and Password Required !!!")
   }


  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
   //console.log("User Comming From DB : ",user);
   
  if (!user) throw new ApiError(400, "User Does not Exits !!");

  const isUserPasswordCorrect = user.IsPasswordCorrect(password);

  if (!isUserPasswordCorrect)
    throw new ApiError(402, "Password Is Not Correct !!");

   // for returning to user only access as bearer
  const {AccessToken,RefreshToken}=await generateAccessANDRefreshToken(user._id)

  const LoggedInUser=await User.findById(user._id).select('-password -refreshToken')

  if(!LoggedInUser) throw new ApiError(500,"User Not logged In Successfully !!")
   

  // for cokkie 
  const options={
  httpOnly:true,
  secure:true
  }
// cookie are stored in ( "key" : value)   cookie("Name",murtaza,options)

  res
  .status(200)
  .cookie("accessToken",AccessToken,options)
  .cookie("refreshToken",RefreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user:LoggedInUser,RefreshToken,AccessToken
      },
      "User login Successfully"
    )
  )  
});

export const Logout=asyncHandler(async(req,res)=>{
  // for logout simple take req.user bcz we already add it and then update db by refresh token=""
  
  const user=req.user
  // console.log('User getting from request  reg.user :'+user);
  
  await User.findByIdAndUpdate(user._id,{
    $set:{refreshToken:undefined}},{new:true})

    const options={
      httpOnly:true,
      secure:true
    }
    
     return res
    .status(200)
    .clearCookie("accessToken",AccessToken,options)
    .clearCookie("refreshToken",RefreshToken,options)
    .json(
      new ApiResponse(200,{},"User logged out Succesfully !!")
    )

  })

export const NewRefreshToken=asyncHandler(async(req,res)=>{
  // take token (refreshtoken) from cokkies 
  // verify token
  // user=await findbyid(token._id)
  // generateccessandrefeshtoken(user._id)
  // cookkie set (new tokens)
 try {
   const CookieIncommingToken=req.cookies?.refreshToken||req.body.refreshToken||req.header("Authentication").replace('Bearer'," ")

  //  console.log("Cookie Incomming Token"+CookieIncommingToken);
  //  console.log("ENV Incomming Token"+process.env.REFRESH_TOKEN_SECRET);
  
   if(!CookieIncommingToken) throw new ApiError(402,"UnAuthorized User")
 
   const verifytoken=jwt.verify(CookieIncommingToken,process.env.REFRESH_TOKEN_SECRET)
   console.log("Verify Token :-"+verifytoken);

   if(!verifytoken) throw new ApiError(401,"UnAuthorized Token")
 
   const DbIncomingUser=await User.findById(verifytoken._id).select('-password -refreshToken')
   console.log("DB INCOMING USER :- "+DbIncomingUser);
   if(!DbIncomingUser) throw new ApiError(404,"REFRESH TOKEN NOT AUTHORIZED")
     
   const {RefreshToken,AccessToken}=await generateAccessANDRefreshToken(DbIncomingUser._id)  
   const options={
     httpOnly:true,
     secure:true,
   }
 
   return res
   .status(200)
   .cookie("AccessToken",AccessToken,options)
   .cookie("AccessToken",RefreshToken,options)
   .json(
     new ApiResponse(200,{AccessToken,RefreshToken},"New Refresh Token Generated Succesfully !!")
   )  
 
 } catch (error) {
   throw new ApiError(401,error?.message||"Invalid Refresh Token")
 }
})

export const UpdatePassword=asyncHandler(async(req,res)=>{
  // Take {Oldpassword,newpassword} from req.body
  // dbuser=req.user._id  db call
  // dbuser.ispasswordcorrect(oldpass)
  // dbuser.password=password
  // dbuser.save

  const {Oldpassword,Newpassword}=req.body
  const dbuser=await User.findById(req.user._id)
  if(!dbuser) throw new ApiError(401,"User Not Found !!");
 
  if(!Oldpassword || !Newpassword ) throw new ApiError(400,"Password Fields are Required !!")

  const VerifiedPassword=await dbuser.IsPasswordCorrect(Oldpassword)
  if(!VerifiedPassword) throw new ApiError(402,"Invalid Password !!");
  console.log("Verified Password  "+VerifiedPassword);

  dbuser.password=Newpassword
  dbuser.save({validateBeforeSave:false})
  
  return res
  .status(200)
  .json( new ApiResponse(200,{},"Password Changed SuccessFully"))

})

export const GetCurrentUser=asyncHandler(async(req,res)=>{
const user=req.user

return res
.status(200)
.json(
  new ApiResponse(200,user,"User Info Loading ")
)

})

export const UpdateAccountDetails=asyncHandler(async(req,res)=>{
  const {Fullname,email}=req.body
  if(!email || !Fullname) throw new ApiError(402,"Invalid Crenditials !!")
  
  const currentuser=req.user 
  await currentuser.findByIdAndUpdate(currentuser._id,
    {
       $set:
        {
         Fullname:Fullname
        }
    },
    {
      new:true
    }
  ).select('-password -refreshToken')
  
  return res
  .status(200)
  .json(
    new ApiResponse(200,{"Fullname: ":Fullname},"Fullname Changed Succesfully")
  )
})

export const UpdateAvatar=asyncHandler(async(req,res)=>{
  const avatarURL=req.file?.path
  const CloudinaryURL= await Cloudnairy_Uplaod(avatarURL)
 
  const currentuser=req.user 
  const DbuserUpdated=await currentuser.findByIdAndUpdate(currentuser._id,
    {
      $set:{
             avatar:CloudinaryURL
        }
    },
    {
      new:true
    }
  ).select('-password -refreshToken')

  return res
  .status(200)
  .json(
    new ApiResponse(200,{DbuserUpdated},"Avatar Updated Successfully")
  )

})

export const UpdateCoverImage=asyncHandler(async(req,res)=>{

})

