import React, {ReactElement, useEffect, useState} from 'react';
import {Auth} from "../../components/auth";

export let AuthContext = React.createContext<{isAuthenticated?:boolean,verifyAuthentication:()=>void} | undefined>(undefined);
export const AuthContextProvider = ({children}:{children:ReactElement[] | ReactElement })=>{
    let [isAuthenticated,setAuth] = useState(false)
    useEffect(()=>{
       /*
       Check for local
       If session then redirect to '/report'
       If no session then redirect to '/local'
        */

        verifyAuthentication();
    },[])
    function verifyAuthentication() :void{
        setAuth(true);
    }

    return (
        <AuthContext.Provider value={{isAuthenticated,verifyAuthentication}} >{isAuthenticated ? children : <Auth />}</AuthContext.Provider>
    )
}