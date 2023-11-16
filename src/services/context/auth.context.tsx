import React, {ReactElement, useEffect, useState} from 'react';
import {Validator} from "../../components/AuthPanel";
import {Spinner} from "../../components/utility/spinner/spinner";
import {_props} from "../network/network";
import {useNavigate, useParams} from "react-router-dom";

export let AuthContext = React.createContext<{
    isAuthenticated?: boolean,
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

    const [loading, setLoad] = useState(true);
    return (
        <AuthContext.Provider
            value={{isAuthenticated, verifyAuthentication}}>{!loading ? (isAuthenticated && !invitation) ? children :
            <Validator/> : <Spinner/>}</AuthContext.Provider>
    )
}