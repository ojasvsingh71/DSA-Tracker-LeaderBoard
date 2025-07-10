import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser({ token });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};