import useAuth from "../hooks/useAuth.js";
import {Navigate, useNavigate} from "react-router";

export default function Protected({children}) {
    const {loading, user} = useAuth()
    const navigate = useNavigate()

    if(loading) {
        return <main><span className={"loader"}></span></main>
    }

    if(!user) {
        return <Navigate to="/login" />
    }

    return children
}