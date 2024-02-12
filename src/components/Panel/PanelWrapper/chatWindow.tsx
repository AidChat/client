import React from 'react';
import {GroupListPanel} from "../Conversation/GroupsListPanel/groupListPanel";
import {Chat} from "../ChatPanel/chat";
import {UtilityPanel} from "../GroupsPanel";


export function ChatWindow() {
    return <div className={'chatWrapper'}>
        <div className={'chatContainer shadow-box '}>
            <div className={'containerA'}><GroupListPanel/></div>
            <div className={'containerB'}><Chat/></div>
            <div className={'containerC'}><UtilityPanel/></div>
        </div>
    </div>
}