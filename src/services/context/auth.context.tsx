import React, {ReactElement, useEffect, useState} from 'react';
import {Validator} from "../../components/AuthPanel";
import {Spinner} from "../../components/utility/spinner/spinner";
import {_props, reqType, service, serviceRoute} from "../network/network";
import {useNavigate, useParams} from "react-router-dom";

export let AuthContext = React.createContext<{
    isAuthenticated?: boolean,
    removeUserSession: ()=>void,
    verifyAuthentication: (session_id?: string,forceReload?:boolean) => void
} | undefined>(undefined);
export const AuthContextProvider = ({children}: { children: ReactElement[] | ReactElement }) => {
    const navigate = useNavigate()
    let [isAuthenticated, setAuth] = useState(false);
    const [invitation, _invitation] = useState<boolean>(false);
    const {requestCode} = useParams();
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
    useEffect(() => {
        if (requestCode) {
            setAuth(false);
            _invitation(true);
        }
    }, [requestCode]);

    function stopload() {
        // check for invitation
        setLoad(false);
    }

    function verifyAuthentication(sessionId?: string,forceReload?:boolean): void {
        if (sessionId) window.localStorage.setItem('session', sessionId)
        _props._user().validateSession().then((r) => {
            setAuth(true);
            stopload()
            if(!requestCode){
                navigate('/');
            }
            if(forceReload){
                navigate('/')
                window.location.reload()
            }

        })
            .catch((e) => {
                console.error(e)
                setAuth(false)
                stopload()
            })
    }
    function removeUserSession(){
        setLoad(true)
       _props._db(service.authentication).query(serviceRoute.session, {},reqType.delete)
           .then(()=>{
               localStorage.removeItem('session');
               localStorage.removeItem('_user');
               verifyAuthentication(undefined,true);
           })
    }
    const [loading, setLoad] = useState(true);
    return (
        <AuthContext.Provider
            value={{isAuthenticated, verifyAuthentication,removeUserSession}}>{!loading ? (isAuthenticated && !invitation) ? children :
            <Validator/> : <Spinner/>}</AuthContext.Provider>
    )
}