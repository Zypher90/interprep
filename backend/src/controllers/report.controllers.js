import {PDFParse} from "pdf-parse"
import {generateAIReport} from "../services/ai.service.js";
import Report from "../models/report.model.js";

export async function generateReport(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF file is required.",
            });
        }

        const {selfDescription, jobDescription} = req.body;
        if (!jobDescription?.trim()) {
            return res.status(400).json({
                message: "Job description is required.",
            });
        }

        const parser = new PDFParse({ data: req.file.buffer });
        const resumeData = await parser.getText();
        await parser.destroy();

        const aiReport = await generateAIReport({
            resume: resumeData.text,
            selfDescription,
            jobDescription,
        });

        const report = await Report.create({
            user: req.user.id,
            selfDescription,
            jobDescription,
            resume: resumeData.text,
            ...aiReport,
        });

        return res.status(201).json({
            message: "Successfully generated report.",
            report: report,
        });
    } catch (err) {
        console.error("generateReport failed:", err);
        next(err);
    }
}

export async function getReportById(req, res, next) {
    try {
    const { reportID } = req.params;

    const interviewReport = await Report.findById(reportID)
    if (!interviewReport) {
        return res.status(404).json({
            message: "No reports found with this ID"
        })
    }

    return res.status(200).json({
        message: "Successfully retrieved report",
        report: interviewReport
    })
    } catch (err) {
        next(err);
    }
}

export async function getAllReports(req, res, next) {
    try {
    const reports = await Report.find({user: req.user.id}).sort({createdAt: -1}).select("-resume -behaviouralQuestions -technicalQuestions -skillGaps -preparationPlan")
    return res.status(200).json({
        message: "Successfully retrieved all reports for the current user",
        reports
    })
    } catch (err) {
        next(err);
    }
}