import {GoogleGenAI} from "@google/genai";
import {GOOGLE_API_KEY} from "../config/env.config.js";
import * as z from "zod";
import {puppeteer} from "puppeteer";

const ai = new GoogleGenAI({
    apiKey: GOOGLE_API_KEY
})

const reportSchema = z.object({
    matchScore: z.number().describe("A score from 0 to 100 indicating how strongly the candidate's portfolio matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical questions that could be asked in an interview"),
        intention: z.string().describe("The intention of the interviewer to ask such questions"),
        answer: z.string().describe("The answer that could be provided by the candidate"),
    })).describe("The technical questions that could be asked in an interview along with their intention and answer"),
    behaviouralQuestions: z.array(z.object({
        question: z.string().describe("The behavioural questions that could be asked in an interview"),
        intention: z.string().describe("The intention of the interviewer to ask such questions"),
        answer: z.string().describe("The answer that could be provided by the candidate"),
    })).describe("The behavioural questions that could be asked in an interview along with their intention and answer"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that the candidate is missing"),
        severity: z.enum(["low", "medium", "high"]).describe("Severity of the lack of skill of the candidate in the skill"),
    })),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The focus of the day number in the preparation plan"),
        tasks: z.array(z.string()).describe("List of tasks to be tackled on this specific day"),
    })).describe("A day-wise preparation plan for the candidate to prepare the best for their interview, containing the main focus and tasks for a day-to-day basis"),
    title: z.string().describe("The title of the job position the applicant is applying for")
})


export async function generateAIReport({resume, selfDescription, jobDescription}) {
    const prompt = `Generate an interview report for a candidate with the following details: 
    Resume: ${resume}, 
    Self description of candidate: ${selfDescription}, 
    Job description candidate is aiming for: ${jobDescription}`
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(reportSchema),
        }
    })
    if (!response.text) {
        throw new Error("AI service returned an empty response.");
    }
    return JSON.parse(response.text)
}

const resumePdfSchema = z.object({
    html: z.string().describe("The HTML content of the resume which can be converted to PDF format using puppeteer or any other library"),
})

export async function generateResumePdf({resume, selfDescription, jobDescription}) {
    const prompt = `Generate a resume in HTML format for a candidate with the following details:
                    Resume: ${resume},
                    Self description of candidate: ${selfDescription},
                    Job description candidate is aiming for: ${jobDescription}
                    The HTML should be well-structured and formatted, suitable for conversion to PDF.`
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(resumePdfSchema),
        }
    })
    if(!response.text) {
        throw new Error("AI service returned an empty response.");
    }
    const content = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(content.html)
    return pdfBuffer
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, {waitUntil: 'networkidle0'});
    const buffer = await page.pdf({format: 'A4'});
    await browser.close();
    return buffer;
}