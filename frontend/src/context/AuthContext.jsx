import React, { useContext } from 'react'
import { createContext, useState } from 'react'
import { useNavigate } from "react-router-dom";


export const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    
    const storedUser = localStorage.getItem("user");

    const [user, setUser] = useState(
    storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null
    );


    const navigate=useNavigate();  //This lets you change pages.

    const login=(token,user)=>{
        localStorage.setItem("token",token)
        localStorage.setItem("user",JSON.stringify(user));
        setToken(token);
        setUser(user);
        navigate("/dashboard");
    }

    const logout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        navigate("/login");
    }

    return(
        <AuthContext.Provider value={{token,user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>useContext(AuthContext);

// AuthContext → Creates an empty container.
// AuthProvider → Fills that container with data (token, user, login, logout).
// useAuth() → Lets any component access the data inside that container.