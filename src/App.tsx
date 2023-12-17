import React, {useContext, useEffect} from 'react';
import './App.css';
import {RouterProvider} from "react-router-dom";
import {router} from "./utils/routes";
import {ShellContext} from "./services/context/shell.context";
import {SocketEmitters} from "./utils/interface";

function App(): React.ReactElement {
    const {socket} = useContext(ShellContext)
    useEffect(() => {
        return ()=>{
            socket?.emit(SocketEmitters._DISCONNECT)
        }
    }, []);
    return (
            <RouterProvider router={router}></RouterProvider>
    );
}
export default App;
