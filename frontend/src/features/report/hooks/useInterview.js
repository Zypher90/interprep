import { ReportContext } from "../report.context.jsx";
import {useContext} from "react";
import {getReportById, getAllReports, generateReport, generateResumePdf} from "../services/interview.api.js";

export const useInterview = () => {
    const context = useContext(ReportContext)
    if(!context){
        throw new Error("Unable to fetch interview context");
    }

    const {loading, setLoading, report, setReport, reports, setReports} = context;

    const generateInterviewReport = async ({resume, selfDescription, jobDescription}) => {
        setLoading(true);
        let interviewReport = null
        try {
            interviewReport = await generateReport({selfDescription, jobDescription, resume});
            setReport(interviewReport.report);
        }catch (e) {
            console.log(e)
        }finally {
            setLoading(false);
        }
        return interviewReport?.report
    }

    const getInterviewReport = async (reportId) => {
        setLoading(true);
        let interviewReport = null
        try {
            interviewReport = await getReportById(reportId);
            setReport(interviewReport.report);
        }catch (e) {
            console.log(e)
        }finally {
            setLoading(false);
        }
        return interviewReport?.report
    }

    const getAllInterviewReports = async () => {
        setLoading(true);
        let interviewReports = null
        try {
            interviewReports = await getAllReports();
            setReports(interviewReports.reports);
        }catch (e) {
            console.log(e)
        }finally {
            setLoading(false);
        }
        return interviewReports?.reports
    }

    const getResumePdf = async ({reportID}) => {
        setLoading(true);
        let response = null
        try {
            response = await generateResumePdf({reportID});
            const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `resume_${reportID}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }catch (e) {
            console.log(e)
        }finally {
            setLoading(false);
        }
        return response
    }
    return {loading, report, reports, generateInterviewReport, getAllInterviewReports, getInterviewReport, getResumePdf};
}