import { asyncHandler } from "../utils/Asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Cloudnairy_Uplaod } from "../utils/Fileupload.js";
import ApiResponse from "../utils/Apiresponse.js";


 const generateAccessANDRefreshToken = async (userId) => {
  // This method do only 3 things 
// -> Find User by id  which already exists
// -> Generate Access AND Refersh Token
// -> update Refreshtoken and save user new obj bcz you add refresh token  

  try {
   const user=await User.findById(userId);

   const AccessToken=user.AccessToken()
   const RefreshToken=user.RefreshToken()

  console.log("user Before Refresh Token",user);
  console.log("ACCEES  TOKEN: ",AccessToken);
  console.log("REFRESH TOKEN: ",RefreshToken);  
  // when we take the refresh and acces token we want to save in the user obj present in db
  // so first update existing one 
  // then save the existing one 
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
  console.log('User getting from request  reg.user :'+user);
  
  await User.findByIdAndUpdate(user._id,{
    $set:{refreshToken:undefined}},{new:true})

    options={
      httpOnly:true,
      secure:true
    }
    
     return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
      new ApiResponse(200,{},"User logged out Succesfully !!")
    )

  })
