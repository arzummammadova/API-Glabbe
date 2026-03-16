import mongoose from "mongoose"

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
        enum:["business","doctor","lawyer","accountant","nail salon","hair salon","spa","beauty salon","other","massage","barber","tattoo","piercing","other"],
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
        required:true,
    }
    



},{timestamps:true})


export const User=mongoose.model("User",userSchema)
