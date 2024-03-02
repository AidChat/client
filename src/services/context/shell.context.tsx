import React, {ReactElement, useEffect, useState} from "react";
import {io} from "socket.io-client";
import {service} from "../../utils/enum";


export const ShellContext = React.createContext<any>({
  snackbarProps: {show: false, message: ""},
});

export type sidePanelType = "Group" | "Util";
export enum EsidePanel {
  group = "Group",
  utit = "Util",
}

export function ShellContextProvider({children}: {children: ReactElement}) {
  const [refetch, _setRefetch] = useState<boolean>(false);
  const [snackbarProps, setShowSnackbarProps] = useState({
    show: false,
    message: "",
  });
  const [groupId, _setGroupId] = useState<null | string>(null);
  const [selectedGroupType, _setGroupType] = useState<
    "CHAT" | "INVITE" | "JOIN" | null
  >(null);
  const [userId, _setUserId] = useState<string | null>(null);
  const [socketId, _socketId] = useState(null);
  const [requestId, _requestId] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [trigger, _trigger] = useState<boolean>(false);
  const [sidePanel, updateSidePanelState] = useState<{
    Util: boolean;
    Group: boolean;
  }>({Util: false, Group: true});
  function ping(s?: string) {
    _trigger(true);
  }

  useEffect(() => {
    if (trigger) {
      _trigger(false);
    }
  }, [trigger]);

  useEffect(() => {
    setSocket(
      io(service.messaging, {
        autoConnect: true,
        reconnectionAttempts: 2,
        auth: {
          socketID: socketId,
          session: window.localStorage.getItem("session")
            ? window.localStorage.getItem("session")
            : "",
        },
      })
    );
  }, [socketId]);

  function showSnackbar(msg: string) {
    setShowSnackbarProps({show: true, message: msg});
    setTimeout(() => {
      setShowSnackbarProps({show: false, message: ""});
    }, 5000);
  }

  return (
    <ShellContext.Provider
      value={{
        ping,
        trigger,
        snackbarProps,
        showSnackbar,
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
        updateSidePanelState,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}
