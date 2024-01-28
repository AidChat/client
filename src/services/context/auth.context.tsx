import React, {ReactElement, useEffect, useState} from 'react';
import {Validator} from "../../components/AuthPanel";
import {Spinner} from "../../components/utility/Spinner/spinner";
import {_props, reqType, service, serviceRoute} from "../network/network";
import {useNavigate, useParams} from "react-router-dom";
import {UserProps} from "../../utils/interface";
import {UserDetailsForm} from "../../pages/consent";

export let AuthContext = React.createContext<{
    isAuthenticated?: boolean,
    removeUserSession: () => void,
    verifyAuthentication: (session_id?: string, forceReload?: boolean) => void
} | undefined>(undefined);
export const AuthContextProvider = ({children}: { children: ReactElement[] | ReactElement }) => {
    const navigate = useNavigate()
    const [isAuthenticated, setAuth] = useState(false);
    const [invitation, _invitation] = useState<boolean>(false);
    const [loading, setLoad] = useState(true);
    const {requestCode} = useParams();
    const [showUserForm, setFormVisibility] = useState<boolean>(true);
    useEffect(() => {
        verifyAuthentication()
    }, [])
    useEffect(() => {
        if (requestCode) {
            setAuth(false);
            _invitation(true);
        }
    }, [requestCode]);

    function stopload() {
        setLoad(false);
    }

    function verifyAuthentication(sessionId?: string, forceReload?: boolean): void {
        if (sessionId) window.localStorage.setItem('session', sessionId);
        _props._user().validateSession().then(() => {
            _props._user().get().then((user: any) => {
                if (user) {
                    debugger
                    if (user.data.Type === 'Pending') {
                        setFormVisibility(true);
                    }else{
                        setFormVisibility(false);
                    }
                    setAuth(true);
                    if (!requestCode) {
                        navigate('/');
                    }
                    if (forceReload) {
                        navigate('/')
                        window.location.reload()
                    }
                    if (!forceReload) {
                        stopload()
                    }
                }

            })


        })
            .catch((e) => {
                console.error(e)
                setAuth(false);
                if (!sessionId) {
                    stopload();
                }
            })
    }

    function removeUserSession() {
        setLoad(true)
        _props._db(service.authentication).query(serviceRoute.session, {}, reqType.delete)
            .then(() => {
                localStorage.removeItem('session');
                localStorage.removeItem('_user');
                verifyAuthentication(undefined, true);
            })
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                verifyAuthentication,
                removeUserSession
            }}>{!loading ? (isAuthenticated && !invitation) ?

                showUserForm ? <UserDetailsForm />
                    : children :
            <Validator/> : <Spinner/>}</AuthContext.Provider>
            )
        }

