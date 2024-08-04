import React, {ReactElement, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {EwindowSizes, service} from "../../utils/enum";
import {useWindowSize} from "../hooks";
import {_props} from "../network/network";
import {UserProps} from "../../utils/interface";

export const ShellContext = React.createContext<any>({});

export function ShellContextProvider({children}: { children: ReactElement }) {
    const [refetch, _setRefetch] = useState<boolean>(false);
    const [groupId, _setGroupId] = useState<null | string>(null);
    const [selectedGroupType, _setGroupType] = useState<
        "CHAT" | "INVITE" | "JOIN" | null
    >(null);
    const [userId, _setUserId] = useState<string | null>(null);
    const [socketId, _socketId] = useState(null);
    const [requestId, _requestId] = useState<string | null>(null);
    const [messageSocket, setMessageSocket] = useState<any>(null);
    const {size: isSmall} = useWindowSize(EwindowSizes.S);
    const [sidePanel, updateSidePanelState] = useState<{
        Util: boolean;
        Group: boolean;
    }>({Util: !isSmall, Group: true});
    useEffect(() => {
        updateSidePanelState({Util: true, Group: true});
    }, [isSmall]);





    return (
        <ShellContext.Provider
            value={{
                _setGroupId,
                groupId,
                _setUserId,
                userId,
                socket: messageSocket,
                _socketId,
                socketId,
                _requestId,
                requestId,
                selectedGroupType,
                _setGroupType,
                refetch,
                _setRefetch,
                sidePanel,
                updateSidePanelState: isSmall ? updateSidePanelState : null,
            }}
        >
            {children}
        </ShellContext.Provider>
    );
}
