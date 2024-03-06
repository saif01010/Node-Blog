import mongoose,{Schema} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePic:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    
    }
},{timestamps:true});

userSchema.plugin(aggregatePaginate);

userSchema.pre("save", function(next){
    if(!this.isModified("password")) return next();
    this.password =  bcrypt.hashSync(this.password,10);
    next();
});

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
};

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {_id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName},

        process.env.JWT_SECRET,

        {
            expiresIn: process.env.JWT_EXPIRY
        }
    );
    
}

userSchema.methods.generateresfreshToken = async function(){
    return jwt.sign(
        {_id: this._id,
        email:this.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRY
        }
    );  
};

export const User = mongoose.model("User",userSchema);