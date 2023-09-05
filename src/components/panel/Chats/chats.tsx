import React from 'react';
import './index.css'
import emptyChats from './../../../assets/svg/empty-chats.svg'
import {getString} from "../../../utils/strings";
import {IoSend} from "react-icons/io5";
import {FcAddImage} from "react-icons/fc";

export function Chats() {
    let chats = {chats: []};
    return (<div className={'chatContainer'}>
        <div className={'wrapper'}>
            {chats.hasOwnProperty('chats')
                ? <ConversationPanel></ConversationPanel> :
                <div className={'noChatContainer'}>
                    <div className={'emptyImage'}><img src={emptyChats} alt={'No Chats'}/></div>
                    <div className={'font-primary'}>{getString(2)}</div>
                </div>}
        </div>
    </div>)

}

function ConversationPanel() {
    return (
        <div className={'convoPanel'}>
            <div className={'convoHistory'}></div>
            <div className={'optionsPanel'}>
                <div><FcAddImage size={'2rem'} color={'green'}/></div>
                <div className={'inputWrapper'}><input type={'text'} className={'sendInput'}
                                                       placeholder={'Type something here...'}/></div>
                <div>
                    <div><IoSend size={'2rem'} color={'green'}/></div>
                </div>
            </div>

        </div>
    )
}

