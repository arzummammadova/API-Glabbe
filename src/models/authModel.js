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
    services: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true }
        }
    ],
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
    },
    resetPasswordToken:{
        type:String,
        required:false
    },
    resetPasswordExpires:{
        type:Date,
        required:false
    },
    plan: {
        type: String,
        enum: ["pro", "adi"],
        default: "adi"
    },
    subscriptionExpiration: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days trial by default
    },
    publicProfileSettings: {
        showEmail: { type: Boolean, default: true },
        showPhone: { type: Boolean, default: true },
        showBio: { type: Boolean, default: true },
        showServices: { type: Boolean, default: true },
        isPublic: { type: Boolean, default: true }
    }
},{timestamps:true})

userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


export const User=mongoose.model("User",userSchema)
