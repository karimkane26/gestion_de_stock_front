/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext,useState,useContext } from "react";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('post-user');
        return storedUser ? JSON.parse(storedUser) : null;
    })
    
    const login = (userData,token) => {
        setUser(userData)
        localStorage.setItem('post-user', JSON.stringify(userData))
        localStorage.setItem('pos-token',token)
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('post-user')
        localStorage.removeItem('pos-token')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);
export default AuthProvider