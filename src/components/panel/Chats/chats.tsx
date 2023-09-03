import React from 'react';
import './index.css'
import emptyChats from './../../../assets/svg/empty-chats.svg'
import {getString} from "../../../utils/strings";

export function Chats() {
    let chats = {};

    return (<div className={'chatContainer'}>
        <div className={'wrapper'}>
            {chats.hasOwnProperty('chats')
                ? <></> :
                <div className={'noChatContainer'}>
                    <div className={'emptyImage'}><img src={emptyChats} alt={'No Chats'}/></div>
                    <div className={'font-primary'}>{getString(2)}</div>
                </div>}
        </div>
    </div>)

}

