import jwt from 'jsonwebtoken';
import {JWT_SECRET} from "../config/env.config.js";
import blacklistModel from "../models/blacklist.model.js";

export async function authorizeUser (req, res, next){
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            error: 'Token not found'
        })
    }

    const blacklistedToken = await blacklistModel.findOne({token})
    if(blacklistedToken){
        return res.status(401).json({
            error: "Invalid token",
        })
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);

    }catch(err) {
        return res.status(401).json({
            error: 'Invalid Token'
        })
    }

    next()
}

export const validateResponse = async (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        const formattedErrors = {};

        Object.keys(err.errors).forEach((key) => {
            formattedErrors[key] = err.errors[key].message;
        });

        return res.status(422).json({
            status: 'fail',
            errors: formattedErrors
        });
    }

    // Handle MongoDB Duplicate Key Error (Code 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(422).json({
            status: 'fail',
            errors: { [field]: `${field} already exists.` }
        });
    }

    return res.status(500).json({ status: 'error', message: 'Something went wrong.' });
}