import React, {ReactElement, useEffect, useState} from 'react';
import {io} from "socket.io-client";
import {service} from "../network/network";


interface ShellInterface {
    snackbarProps: {
        show: boolean,
        message: string
    },
    setShowSnackbarProps?: (V: boolean) => void,
    showSnackbar?: (M: string) => void,
    _setGroupId: (Id: string) => void,
    groupId: string | null,
    _setUserId: (Id: string) => void,
    userId: string | null,
    socketId: string | null,
    _setSocketId: (S: string) => void
}

export const ShellContext = React.createContext<any>({snackbarProps: {show: false, message: ''}});


export function ShellContextProvider({children}: { children: ReactElement }) {
    const [snackbarProps, setShowSnackbarProps] = useState({show: false, message: ''});
    const [groupId, _setGroupId] = useState<null | string>(null);
    const [userId, _setUserId] = useState<string | null>(null)
    const [socketId, _socketId] = useState(null)
    const [socket, setSocket] = useState<any>(io(service.messaging, {
        autoConnect: true,
        auth: {
            'socketID': socketId,
            'session': window.localStorage.getItem('session') ? window.localStorage.getItem('session') : ''
        }
    }));
    const [trigger,_trigger] = useState<boolean>(false);
    // TODO
    /*
    Make a function that takes some args and trigger data refresh if its calles
     */
    function ping(s?:string){
       _trigger(true);
    }

    useEffect(() => {
        if(trigger){
            _trigger(false)
        }
    }, [trigger]);

    useEffect(() => {
        if(socketId){
            setSocket(io(service.messaging, {
                autoConnect: true,
                auth: {
                    'socketID': socketId,
                    'session': window.localStorage.getItem('session') ? window.localStorage.getItem('session') : ''
                }
            }))
        }
    }, [socketId]);

    function showSnackbar(msg: string) {
        setShowSnackbarProps({show: true, message: msg})
        setTimeout(() => {
            setShowSnackbarProps({show: false, message: ''})
        }, 5000)
    }

    return (
        <ShellContext.Provider
            value={{ping,trigger,snackbarProps, showSnackbar, _setGroupId, groupId, _setUserId, userId, socket, _socketId,socketId}}>
            {children}
        </ShellContext.Provider>
    )
}