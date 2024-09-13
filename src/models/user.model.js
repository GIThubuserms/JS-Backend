
import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const UserSchema=new Schema(
    {
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true,   //special  
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
    },
    Fullname:{
        type:String,
        required:true,
        lowercase:true,
        index:true,
        trim:true,
    },
    password:{
        type:String,       // encrypt policy           
        required:[true,'Password is required']
    },
    avatar:{
        type:String,          // Cloudnairy
        required:true,
    },
    coverimage:{
        type:String,     // Cloudnairy
        required:true,
    },
    refreshToken:{
        type:String,
        required:true,
    },
    Watchhistory:[
        {
        type:Schema.Types.ObjectId,
        ref:'Vedio'
        }
    ]
},{timestamps:true})




// pre is pre defined hook use for a middlewere and check as pre function for some work and here we are hashing password so it can stored in database in hash password form 

UserSchema.pre('save',async function(next)
{
    if(!this.password.ismodified("password")) return next() ;
    this.password = bcrypt.hash(this.password,10)
    next()
})

// self functionn 
//  IsPasswordCorrect('12344')

UserSchema.methods.IsPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)  // first argument is our password or user second is the orignal database stored password
}


UserSchema.methods.AccessToken=function()
{
    return jwt.sign({
        _id:this._id,
        Fullname:this.Fullname,
        username:this.username,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}


UserSchema.methods.RefreshToken=function()
{    
    return jwt.sign({
        _id:this._id,
        Fullname:this.Fullname,
        username:this.username,
        email:this.email
    },    
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}


export const User=mongoose.model('User',UserSchema)