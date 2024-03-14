import React, {ReactElement, useEffect, useState} from "react";
import {io} from "socket.io-client";
import {EwindowSizes, service} from "../../utils/enum";
import {useWindowSize} from "../hooks/appHooks";


export const ShellContext = React.createContext<any>({});

export function ShellContextProvider({children}: { children: ReactElement }) {
    const [refetch, _setRefetch] = useState<boolean>(false);
    const [groupId, _setGroupId] = useState<null | string>(null);
    const [selectedGroupType, _setGroupType] = useState<"CHAT" | "INVITE" | "JOIN" | null>(null);
    const [userId, _setUserId] = useState<string | null>(null);
    const [socketId, _socketId] = useState(null);
    const [requestId, _requestId] = useState<string | null>(null);
    const [socket, setSocket] = useState<any>(null);
    const {size:isSmall} = useWindowSize(EwindowSizes.S)
    const [sidePanel, updateSidePanelState] = useState<{
        Util: boolean; Group: boolean;
    }>({Util: isSmall ?false:true, Group: true});


    useEffect(() => {
        updateSidePanelState({Util:true,Group:true})
    }, [isSmall]);

    useEffect(() => {
        setSocket(io(service.messaging, {
            autoConnect: true, reconnectionAttempts: 1, auth: {
                socketID: socketId,
                session: window.localStorage.getItem("session") ? window.localStorage.getItem("session") : "",
            },
        }));
    }, [socketId]);


    return (<ShellContext.Provider
        value={{
            _setGroupId,
            groupId,
            _setUserId,
            userId,
            socket,
            _socketId,
            socketId,
            _requestId,
            requestId,
            selectedGroupType,
            _setGroupType,
            refetch,
            _setRefetch,
            sidePanel,
            updateSidePanelState : isSmall ? updateSidePanelState :null,
        }}
    >
        {children}
    </ShellContext.Provider>);
}
