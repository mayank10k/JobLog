import API from '../api/axios'

export const registerUser=async (name,email,password)=>{
    const res=await API.post("/auth/signup",{name,email,password})
    return res.data;
};

export const loginUser=async (email,password)=>{
    const res=await API.post("/auth/login",{email,password});
    return res.data;
};

export const logoutUser=async ()=>{
    const res=await API.post("/auth/logout");
    return res.data;
};