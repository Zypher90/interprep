import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api/report',
    withCredentials: true
})

export async function generateReport({selfDescription, jobDescription, resume}) {
    const formData = new FormData();
    formData.append('selfDescription', selfDescription);
    formData.append('jobDescription', jobDescription);
    formData.append('resume', resume);
    const response = await api.post("/", formData);
    return response.data
}

export async function getReportById(reportID) {
    const response = await api.get(`/${reportID}`);
    return response.data;
}

export async function getAllReports() {
    const response = await api.get('/')
    return response.data
}