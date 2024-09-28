
import ChatPage from "./components/ChatPage/ChatPage";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Login/Login";
import ProtectedUser from "./auth/ProtectedUser";
import * as React from "react";
import { useRoutes } from "react-router-dom";
function App() {

  let element = useRoutes([
    {
      path: "/",
      element: <Login/>,
      
    },
    {
      path: "/chatRoom",
      element: <ProtectedUser><HomePage/></ProtectedUser>
      
    },
    {
     path:"chat/:userid/:roomid",
     element:<ProtectedUser><ChatPage/></ProtectedUser>
    }
  ]);

  return element;


}

export default App;