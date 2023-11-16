import React from "react";
import './ index.css'
import {AuthContextProvider} from "../../services/context/auth.context";
import {ChatWindow} from "./PanelWrapper/chatWindow";
import {ShellContextProvider} from "../../services/context/shell.context";

export const Panel = () => {
    return (
        <AuthContextProvider>
            <ShellContextProvider>
                <ChatWindow/>
            </ShellContextProvider>
        </AuthContextProvider>
    );
};


