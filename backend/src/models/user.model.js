import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Username is required"],
        maxLength: 20,
        unique: [true, "Username already exists"],
    },

    email: {
        type: String,
        unique: [true, "Email is already in use"],
        required: [true, "Email is required"],
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 8,
    }
})

const User = mongoose.model('users', userSchema);

export default User;
