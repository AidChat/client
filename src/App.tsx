import React, {useContext, useEffect} from 'react';
import './App.css';
import {RouterProvider} from "react-router-dom";
import {router} from "./utils/routes";
import {ShellContext} from "./services/context/shell.context";
import {SocketEmitters} from "./utils/interface";
import { GoogleOAuthProvider } from '@react-oauth/google';
function App(): React.ReactElement {
    const {socket} = useContext(ShellContext)
    useEffect(() => {
        return ()=>{
            socket?.emit(SocketEmitters._DISCONNECT)
        }
    }, []);
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GG_APP_ID ? process.env.REACT_APP_GG_APP_ID : ''}>
            <RouterProvider router={router}></RouterProvider>
        </GoogleOAuthProvider>
    );
}
export default App;
