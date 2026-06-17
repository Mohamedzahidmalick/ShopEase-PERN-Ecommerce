import { children } from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedroute=({children})=>{
    const token =localStorage.getItem("admin_token");
    const role=localStorage.getItem("role");

    if(!token || role!=="admin") {return <Navigate to="/admin/login"/>}

    return children;
}

export default AdminProtectedroute;