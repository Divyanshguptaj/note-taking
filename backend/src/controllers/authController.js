import jwt from 'jsonwebtoken'
import User from '../models/User.js';
import OTP from '../models/OTP.js'
import otpgenerator from "otp-generator"
import bcrypt from "bcrypt"
// import dotenv from 'dotenv';
// dotenv.config();

export const sendOTP = async (req, res)=>{
    try{
        const {email} = req.body;
        const checkUserPresent = await User.findOne({email})
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: "User already exists! , Please go and try for login ...", 
            })
        }
        var otp = otpgenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,    
        })
        let result = await OTP.findOne({otp: otp})
        while(result){
            var otp = otpgenerator.generate(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,    
            })
            result = await OTP.findOne({otp: otp})
        }
        const otpPayload = {email, otp};
        await OTP.create(otpPayload);
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error occured at generating otp",
        })
    }
}

export const signUp = async (req,res) =>{
    try{
        const {username, email, password, otp} = req.body; 
        //validation
        if(!username || !password || !otp){
            return res.status(403).json({ 
                success: false,
                message: "All fields are mandatory...",
            })
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            })
        }

        const recentOTP = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        
        if(recentOTP.length===0){
            return res.status(400).json({
                success: false,
                message: "Can't fetch otp",
            })
        }

        if(otp !== recentOTP[0].otp) {
            return res.status(400).json({
                success: false,
                message: "OTP not matched",
            });
        }

        //hash password 
        const hashedPassword = await bcrypt.hash(password, 10);

        //create entry of user 
        const user = await User.create({username, email, password: hashedPassword})

        return res.status(200).json({
            data: user,
            success: true,
            message: "User is registered successfully",
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "User can't registered!, please try again . . .",
        })
    }
}

// login function
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json({
        token,
        user: { id: user._id, username: user.username, email: user.email },
      });
  } catch (error) {
    res.status(500).json({ message: "Error signing in", error });
  }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('email username');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ email: user.email, username: user.username });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};