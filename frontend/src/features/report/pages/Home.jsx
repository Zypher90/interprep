import "../styles/home.styles.css"
import {useRef, useState} from "react";
import {useInterview} from "../hooks/useInterview.js";
import {useNavigate} from "react-router";

export default function Home() {
    const [fileName, setFileName] = useState("")
    const {loading, generateInterviewReport} = useInterview()
    const [selfDescription, setSelfDescription] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const resumeInputRef = useRef()
    const [resumeFile, setResumeFile] = useState(null)

    const navigate = useNavigate();

    const handleChange = e => {
        const files = e.target.files
        if(files.length > 1){
            setFileName("Please choose only a single file")
        }else if (files.length === 1){
            setFileName(files[0].name)
            setResumeFile(files[0])
        }else{
            setFileName("")
        }
    }

    const handleSubmit = async () => {
        if (!resumeFile) {
            setFileName("Please upload a PDF resume before generating a report")
            return
        }
        if (!jobDescription.trim()) {
            return
        }
        const data = await generateInterviewReport({selfDescription, jobDescription, resume: resumeFile})
        if (data?._id) {
            navigate(`/report/${data._id}`)
        }
    }

    if(loading){
        return (
            <div className="loader-container">
            <div className= "loader"></div>
            <span>Generating your interview report...</span>
        </div>)
    }
    else{
        return (
            <div className={"home-container"}>
                <h1>Welcome to AI resume analyzer!</h1>
                <div className="input-group">
                    <label htmlFor="job-description">Job Description</label>
                    <textarea name="job-description" id="job-description" placeholder={"Enter your job description"}
                              onChange={(e)=>setJobDescription(e.target.value)}
                    ></textarea>
                </div>
                <div className="input-group">
                    <label htmlFor="self-description">Self Description</label>
                    <textarea name="self-description" id="self-description" placeholder={"Enter your self description"}
                              onChange={(e)=>setSelfDescription(e.target.value)}></textarea>
                </div>
                <div className="input-group">
                    <label htmlFor="resume" id="resume-label">Upload Resume</label>
                    <input ref={resumeInputRef} hidden type="file" accept=".pdf" name="resume" id="resume" onChange={handleChange}/>
                    <p>
                        <img src="../assets/folder.png" alt=""/>
                        {fileName}
                    </p>
                </div>
                <div className="input-group">
                    <button onClick={handleSubmit}>
                        Generate Report
                    </button>
                </div>
            </div>
        )
    }
}