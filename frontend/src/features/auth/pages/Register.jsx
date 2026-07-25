import "../auth.styles.css"
import {Link, useNavigate} from "react-router";
import {useState} from "react";
import useAuth from "../hooks/useAuth.js";

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const [fieldErrors, setFieldErrors] = useState({})
    const [globalError, setGlobalError] = useState('')

    const {loading, handleRegister} = useAuth()

    const handleSubmit = (e) => {
        e.preventDefault()
        handleRegister({
            name, email, password
        }, setFieldErrors, setGlobalError)
        navigate("/")
    }

    return <main>
        {globalError && <div className={"alert-danger"}>{globalError}</div>}
        {
            loading ?
                <span className="loader"></span>
                :
                <div className="form-container">
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username</label>
                        <input type="text" name={"username"} placeholder={"Enter username"} onChange={(e) => setName(e.target.value)} />
                        {fieldErrors.name && <div className={"error-text"}>{fieldErrors.password}</div>}
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" name="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                        {fieldErrors.email && <div className="error">{fieldErrors.email}</div>}
                        <label htmlFor="password">Password</label>
                        <input type="text" name="password" id="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
                        {fieldErrors.password && <div className="error">{fieldErrors.password}</div>}
                        <button>Register</button>
                    </form>
                    <p>Already have an account? <Link to="/login" style={{
                        color: "white"
                    }}>Login</Link></p>
                </div>
        }
    </main>
}