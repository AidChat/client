import React, {ReactElement, useEffect, useState} from 'react';
import {io} from "socket.io-client";
import {service} from "../network/network";
import {SocketEmitters} from "../../utils/interface";


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

export const socket = io(service.messaging, {
    autoConnect: true,
    reconnectionAttempts:2,
    auth: {
        'session': window.localStorage.getItem('session') ? window.localStorage.getItem('session') : undefined
    }
})

export function ShellContextProvider({children}: { children: ReactElement }) {
    const [refetch,_setRefetch] = useState<boolean>(false);
    const [snackbarProps, setShowSnackbarProps] = useState({show: false, message: ''});
    const [groupId, _setGroupId] = useState<null | string>(null);
    const [selectedGroupType,_setGroupType] = useState<"CHAT" | "INVITE" | "JOIN"| null>(null);
    const [userId, _setUserId] = useState<string | null>(null)
    const [socketId, _socketId] = useState(null);
    const [requestId, _requestId] = useState<string | null>(null)
    const [socket, setSocket] = useState<any>(null);
    const [trigger, _trigger] = useState<boolean>(false);


    useEffect(() => {
        if (trigger) {
            _trigger(false)
        }
    }, [trigger]);

    useEffect(() => {
         socket.emit(SocketEmitters._JOIN,{socketId:socketId});
    }, [socketId]);

    return (
        <ShellContext.Provider
            value={{
                trigger,
                snackbarProps,
                _setGroupId,
                groupId,
                _setUserId,
                userId,
                socket,
                _socketId,
                socketId,
                _requestId,
                requestId,selectedGroupType,
                _setGroupType,
                refetch,
                _setRefetch
            }}>
            {children}
        </ShellContext.Provider>
    )
}