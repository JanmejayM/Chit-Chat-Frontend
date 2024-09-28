import { Navigate } from "react-router-dom";
import UserService from "../services/UserService";
import { useEffect } from "react";
const ProtectedUser = ({ children }) => {

  
      let data=sessionStorage.getItem("userProfile");
      console.log(data)
    
      
      if(sessionStorage.getItem("jwt")!=null && sessionStorage.getItem("userProfile")!=null)
      {
        console.log("pass")
        return children;
      }
       else{
        return <Navigate to="/" replace />;

       }
      
      

  

}
export default ProtectedUser;