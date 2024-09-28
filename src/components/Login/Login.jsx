import React,{useState} from "react";


import "../Login/Login.css";
import UserService from "../../services/UserService";
import { useNavigate } from 'react-router-dom';





 const Login=()=>
{
    const navigate = useNavigate();

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [message, setMessage] = useState('');


   const handleEmailChange = (e) => {
     setEmail(e.target.value);
   };
 
   const handlePasswordChange = (e) => {
     setPassword(e.target.value);
   };
 

   const handleSubmit = async(e) => {
     e.preventDefault();
 
     // Perform JavaScript validation
     if (email === '') {
       setMessage('Please enter your email address');
     } else if (!isValidEmail(email)) {
       setMessage('Please enter a valid email address');
     } else if (password === '') {
       setMessage('Please enter your password');
     } 
    //  else if (password.length < 6) {
    //    setMessage('Password must be at least 6 characters long');
    //  }
      else {
       // Validation passed, perform login logic here
       setMessage('');
       // Continue with your login logic or redirect to a different page
       let obj={
         username:email,
         password:password
       }

       try{
        let token=await UserService.getToken(obj);
        sessionStorage.setItem("jwt",token.data);

        let userProfile= await UserService.getUserProfile(token.data);
        sessionStorage.setItem("userProfile",JSON.stringify(userProfile.data));

        navigate("/chatRoom");
        
       }
       catch(error){
        if(error.response?.status === 403) {
          setMessage("No such User Exist")
      }
      else{
          alert(error)
      }
         
       }

       UserService.getToken(obj).then(
        res=>{
        //console.log(res.data);
        sessionStorage.setItem("jwt",res.data);
        navigate("/chatRoom");

        
        }
       ).catch(
        (error)=>{

                   

            if(error.response?.status === 403) {
                setMessage("No such User Exist")
            }
            else{
                alert(error)
            }
                   
                    
  
           }
       )
      
      /* UserService.login(obj).then(
         res=>{
          

            if(res.data.role==='admin')
            {
               console.log("admin")
               navigate("/admin")
               sessionStorage.setItem("log",JSON.stringify(res.data))
            }
            if(res.data.role==="user")
            {
               console.log("user");
               navigate("/user")
               sessionStorage.setItem("log",JSON.stringify(res.data))

            }
            
         

         }
       ).catch(
         (error)=>{



          if(error.message==="Network Error")
          {

            window.alert(error)
            return;

          }
                    if(error.response.data.status==='UNAUTHORIZED')
                    {
                        setMessage("No such User Exists");

                    } 
                    else{
                            setMessage("Error Occured");
                            window.alert(error)
                    }
                  

         }
       )
     */
        }
    
    
   
   };
 
   const isValidEmail = (email) => {
     // Simple email validation using regex
     const emailRegex = /^\S+@\S+\.\S+$/;
     return emailRegex.test(email);
   };
 
   return(

    <div>

   <div className="container-fluid">
   </div>

    <div className="card-body"  >
      <form onSubmit={handleSubmit} style={{height:'300px',minHeight:'300px'}} >
        <div>
          <input style={{padding:'10px'}} className="form-control" type="email" value={email} onChange={handleEmailChange} placeholder="Email"/>
        </div>
        <div style={{marginBottom:"20px",paddingTop:'20px'}}>
          <input style={{padding:'10px'}} className="form-control" type="password" value={password} onChange={handlePasswordChange} placeholder="Password"/>
        </div>
        <button className="form-control btn btn-dark" type="submit">Login</button>

        {message && <p className="message text-danger">{message}</p>}



      </form>



   </div>
   </div>
   

   );

}
 
export default Login;