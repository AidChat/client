import React from "react";
import './ index.css'
import {AuthContextProvider} from "../../services/context/auth.context";
import {ChatWindow} from "./PanelWrapper/chatWindow";
export const Panel = () => {
    return (
     <AuthContextProvider>
         <ChatWindow />
     </AuthContextProvider>
    );
};


