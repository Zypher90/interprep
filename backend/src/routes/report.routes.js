import {Router} from "express";
import {upload} from "../middleware/file.middleware.js";
import {generateReport, getAllReports, getReportById} from "../controllers/report.controllers.js";
import {authorizeUser} from "../middleware/auth.middleware.js";

const reportRouter = Router();

const handleUpload = (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                message: err.code === 'LIMIT_FILE_SIZE'
                    ? 'Resume file must be 5MB or smaller.'
                    : err.message,
            });
        }
        next();
    });
};

reportRouter.post('/', authorizeUser, handleUpload, generateReport);
reportRouter.get('/:reportID', authorizeUser, getReportById);
reportRouter.get('/', authorizeUser, getAllReports);

export default reportRouter
