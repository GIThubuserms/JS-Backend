import { asyncHandler } from "../utils/Asynchandler.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Cloudnairy_Uplaod } from "../utils/Fileupload.js";
import ApiResponse from "../utils/Apiresponse.js";

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
  const avatarlocalpath = req.files?.avatar?.[0]?.path;
  const coverimagelocalpath = req.files?.coverimage?.[0]?.path;
  console.log(avatarlocalpath);
  console.log(coverimagelocalpath);

  if (!avatarlocalpath) {
    throw new ApiError(400, "Avatary File required");
  }

  let coverimage;
  const avatar = await Cloudnairy_Uplaod(avatarlocalpath);
  coverimagelocalpath && {coverimage:await Cloudnairy_Uplaod(coverimagelocalpath)};
  
  if (!avatar) throw new ApiError(400, "Avatar Not upload on cloudinary");

  const newUser = await User.create({
    username,
    email,
    Fullname,
    password,
    avatar,
    coverimage: coverimage || null,
  });

  // ask from database the is user created
  const userverify = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  if (!userverify) throw new ApiError(500, "User not registred");

  return res
    .status(200)
    .json(new ApiResponse(200, userverify, "User registred succesfully"));
});
