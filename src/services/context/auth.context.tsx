import React, {ReactElement, useEffect, useState} from 'react';
import {Auth} from "../../components/AuthPanel";
import {Spinner} from "../../components/utility/spinner/spinner";
import {_props} from "../network";

export let AuthContext = React.createContext<{
    isAuthenticated?: boolean,
    verifyAuthentication: (session_id?: string) => void
} | undefined>(undefined);
export const AuthContextProvider = ({children}: { children: ReactElement[] | ReactElement }) => {
    let [isAuthenticated, setAuth] = useState(false)
    useEffect(() => {
        _props._user().validateSession().then((d) => {
            verifyAuthentication()
        })
            .catch((e) => {
                console.error(e)
                setAuth(false)
                stopload()
            })
    }, [])

     function stopload(){
        setLoad(false)
     }
    function verifyAuthentication(sessionId?:string): void {
        if(sessionId) window.localStorage.setItem('session',sessionId)
        _props._user().validateSession().then(() => {
            setAuth(true);
            stopload()
        })
            .catch((e) => {
                console.error(e)
                setAuth(false)
                stopload()
            })
    }
    const [loading,setLoad] = useState(true);
    return (
        <AuthContext.Provider value={{isAuthenticated, verifyAuthentication}}>{ !loading ? isAuthenticated ? children :
            <Auth/> : <Spinner />}</AuthContext.Provider>
    )
}