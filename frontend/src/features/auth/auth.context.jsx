import {createContext, useEffect, useState} from 'react'
import {whoami} from "./services/auth.api.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}