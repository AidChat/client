import React from 'react';
import {ContactPanel} from "../Conversation/contactPanel";
import {Chats} from "../ChatPanel/chats";
import {ChatGroups} from "../GroupsPanel";


export function ChatWindow() {
    return <div className={'chatWrapper'}>
        <div className={'chatContainer shadow-box '}>
            <div className={'containerA'}><ContactPanel/></div>
            <div className={'containerB'}><Chats/></div>
            <div className={'containerC'}><ChatGroups/></div>
        </div>
    </div>
}