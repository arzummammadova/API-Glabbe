import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const  userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    firstName:{
        type:String,
        required:false
    },
    lastName:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },

    businessType:{
        type:String,
        enum:["business","doctor","lawyer","accountant","nail salon","hair salon","spa","beauty salon","massage","barber","tattoo","piercing","other"],
        default:"other"
    },
    bio:{
        type:String,
        required:false,
    },
    duration:{
        type:Number,
        required:false,
    },
    price:{
        type:Number,
        required:false,
    },
    userURL:{
        type:String,
        required:false,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationToken:{
        type:String,
        required:false
    }
    



},{timestamps:true})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


export const User=mongoose.model("User",userSchema)
