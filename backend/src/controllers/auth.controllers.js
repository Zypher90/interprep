import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/env.config.js";
import blacklistToken from "../models/blacklist.model.js";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export async function registerUser(req, res) {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        })
    }

    const foundUser = await User.findOne({
        $or: [{name: name}, {email: email}]
    })
    if (foundUser) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const newUser = new User({
        name,
        email,
        password: hash,
    })
    await newUser.save()

    const token = jwt.sign({
        id: newUser._id,
        name: name,
    }, JWT_SECRET, {expiresIn: "1d"})

    res.cookie("token", token)
    return res.status(200).json({
        message: "User successfully registered",
        user: {
            id: newUser._id,
            name: name,
            email: email,
        }
    })
}

export async function loginUser(req, res) {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        })
    }

    const user = await User.findOne({email: email})
    if (!user) {
        return res.status(400).json({
            message: "User does not exist",
        })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if(!isValidPassword) {
        return res.status(400).json({
            message: "Wrong password",
        })
    }

    const token = jwt.sign({
        id: user._id,
        name: user.name
    }, JWT_SECRET, {expiresIn: "1d"})

    res.cookie("token", token)
    return res.status(200).json({
        message: "User successfully logged in",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    })
}

export async function logoutUser(req, res) {
    const token = req.cookies.token;

    if(token) {
        await blacklistToken.create({token})
    }
    await blacklistToken.save()

    res.clearCookie("token");
    res.status(200).json({
        message: "User successfully logged out",
    })
}

export async function whoAmI(req, res) {
    try {
        const decoded = jwt.verify(req.cookies.token, JWT_SECRET);
        const user = await User.findById(decoded.id)
        if(!user) {
            return res.status(400).json({
                message: "User does not exist",
            })
        }

        return res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }catch(err){
        console.log(err)
        return res.status(400).json({
            message: "User details fetched error",
        })
    }
}