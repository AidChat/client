import React, {ReactElement, useEffect, useState} from 'react';
import {Spinner} from "../../components/utility/loader.component";
import {CenterBox} from "../../components/utility/alignment.components";

export let AuthContext = React.createContext<{isAuthenticated:boolean,checkAuth?:any,verifyAuthentication?:()=>void}>({isAuthenticated:false});

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
        <AuthContext.Provider value={{isAuthenticated,verifyAuthentication}} >{isAuthenticated ? children : <CenterBox>{Spinner()}</CenterBox>}</AuthContext.Provider>
    )
}