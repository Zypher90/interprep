import axios from "axios";

export async function register({name, email, password}, setFieldErrors, setGlobalError) {
    try{
        const response = await axios.post("http://localhost:8000/api/auth/register", {
                name, email, password
            }, {withCredentials: true}
        )
        return response.data;
    }catch (e) {
        console.log(e)
        if (e.response && e.response.status === 422) {
            // Extract the key-value errors we structured on the backend
            setFieldErrors(e.response.data.errors);
        }
        else{
            setGlobalError("A network error occurred. Please try again later.");
        }
    }
}

export async function login({email, password}, setFieldErrors, setGlobalError) {
    try {
        const response = await axios.post("http://localhost:8000/api/auth/login", {
            email, password
        }, {withCredentials: true})
        return response.data;
    }catch (e) {
        console.log(e)
    }
}

export async function logout() {
    try {
        const response = await axios.get("http://localhost:8000/api/auth/logout", {
            withCredentials: true
        })
        return response.data;
    }catch (e) {
        console.log(e)
    }
}

export async function whoami() {
    try {
        const response = await axios.get("http://localhost:8000/api/auth/whoami", {
            withCredentials: true
        })
        console.log(response)
        return response.data;
    }catch (e) {
        console.log(e)
    }
}