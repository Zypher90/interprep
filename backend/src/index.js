import express from "express"
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import reportRouter from "./routes/report.routes.js";

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use("/api/auth", authRouter);
app.use("/api/report", reportRouter);
app.use((err, req, res, next) => {
    // Handle Mongoose Validation Errors
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

    console.error(err);

    // Default fallback
    res.status(500).json({
        status: 'error',
        message: err.message || 'Something went wrong.',
    });
});

export default app