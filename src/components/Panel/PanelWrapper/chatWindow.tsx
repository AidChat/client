import React from 'react';
import {Index} from "../Conversation/GroupsListPanel";
import {Chats} from "../ChatPanel/chats";
import {ChatGroups} from "../GroupsPanel";


export function ChatWindow() {
    return <div className={'chatWrapper'}>
        <div className={'chatContainer shadow-box '}>
            <div className={'containerA'}><Index/></div>
            <div className={'containerB'}><Chats/></div>
            <div className={'containerC'}><ChatGroups/></div>
        </div>
    </div>
}