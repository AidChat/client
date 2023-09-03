import React from 'react';
import {ContactPanel} from "../ContactsPanel/contactPanel";
import {Chats} from "../Chats/chats";
import {ChatGroups} from "../ChatGroups";


export function ChatWindow() {
    return <div className={'chatWrapper'}>
        <div className={'chatContainer'}>
            <div className={'containerA'}><ContactPanel/></div>
            <div className={'containerB'}><Chats/></div>
            <div className={'containerC'}><ChatGroups/></div>
        </div>
    </div>
}