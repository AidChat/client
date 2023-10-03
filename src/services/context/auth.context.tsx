import React, {ReactElement, useEffect, useState} from 'react';
import {Auth} from "../../components/AuthPanel";
import {_props} from "../../properties";
import {Spinner} from "../../components/utility/spinner/spinner";

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
                console.error(e.data)
                setAuth(false)
                stopload()
            })
    }, [])

     function stopload(){
        setLoad(false)
     }
    function verifyAuthentication(sessionId?:string): void {
        if(sessionId) window.sessionStorage.setItem('session',sessionId)
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