import {createContext, useState} from "react";

export const ReportContext = createContext()

export default function ReportProvider({ children }) {
    const [loading, setLoading] = useState(true)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    return (
        <ReportContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports }}>
            {children}
        </ReportContext.Provider>
    )
}