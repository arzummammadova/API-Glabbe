import { User } from "../models/authModel.js";


const registerUser=async(req,res)=>{

    try {

        const {username,firstName,lastName,password,email,businessType}=req.body;

        if(!username || !firstName || !lastName || !password || !email || !businessType  ){
            return res.status(400).json({message:"All fields are required"})
        }
        const user=await User.findOne({username});
        const userUrl=process.env.BASE_URL + "/" + username;
        if(user){
            return res.status(400).json({message:"User already exists"})
        }

        const newUser=new User({
            firstName,
            lastName,
            password,
            email,
            businessType,
            userUrl
        })
        
        
       
        await newUser.save();
        res.status(201).json({message:"User registered successfully",user:newUser})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error",error:error.message})
        
    }

}

export default registerUser