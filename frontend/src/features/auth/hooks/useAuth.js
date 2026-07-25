import {useContext, useEffect} from "react";
import {AuthContext} from "../auth.context.jsx"
import {login, logout, register, whoami} from "../services/auth.api.js";

export default function useAuth() {
    const {user, setUser, loading, setLoading} = useContext(AuthContext)

    const handleLogin = async ({ email, password }, setFieldErrors, setGlobalError) => {
        setLoading(true)
        try{
            const data = await login({email, password}, setFieldErrors, setGlobalError)
            setUser(data.user)
        }catch(err){
            if(err.status === 400){
                setGlobalError("Please enter valid credentials")
            }
        }finally{
            setLoading(false)
        }
    }

    const handleRegister = async ({ name, email, password }, setFieldErrors, setGlobalError) => {
        setLoading(true)
        try{
            const data = await register({name, email, password}, setFieldErrors, setGlobalError)
            setUser(data.user)
        }catch (e) {
            if(e.status === 400){
                setGlobalError("Please enter a valid credentials")
            }
        }finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        }catch (e) {
            console.log(e)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const response = await whoami()
                if(response) {
                    setUser(response.user)
                }else{
                    setUser(null)
                }
            }catch (e) {
                console.log("Problem validating session: ", e)
                setUser(null)
            }finally {
                setLoading(false)
            }
        }
        checkUserSession()
    }, []);

    return {user, loading, handleLogin, handleRegister, handleLogout}
}