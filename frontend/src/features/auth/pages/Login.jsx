import "../auth.styles.css"
import {useNavigate, Navigate, Link} from "react-router";
import useAuth from "../hooks/useAuth.js";
import {useState} from "react";

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {loading, handleLogin} = useAuth()
    const [fieldErrors, setFieldErrors] = useState({})
    const [globalError, setGlobalError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await handleLogin({email, password}, setFieldErrors, setGlobalError)
            navigate("/", {replace: true})
        }catch (e) {
            console.log(e)
        }
    }

    return <main>
        {globalError && <div className="alert-danger">{globalError}</div>}
        {
            loading ?
                <span className="loader"></span>
                :
                <div className="form-container">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" name="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                        {fieldErrors.email && <div className={"error-text"}>{fieldErrors.email}</div>}
                        <label htmlFor="password">Password</label>
                        <input type="text" name="password" id="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
                        {fieldErrors.password && <div className={"error-text"}>{fieldErrors.password}</div>}
                        <button>Login</button>
                    </form>
                    <p>Don't have an account? <Link to="/register" style={{
                        color: "white"
                    }}>Register</Link></p>
                </div>
        }
    </main>
}