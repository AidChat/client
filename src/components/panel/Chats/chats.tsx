import React, {FunctionComponent, JSXElementConstructor, ReactElement, ReactNode, useEffect, useRef} from 'react';
import './index.css'
import emptyChats from './../../../assets/svg/empty-chats.svg'
import {getString} from "../../../utils/strings";
import {IoSend} from "react-icons/io5";
import {FcAddImage} from "react-icons/fc";
import {formatTime} from "../../../utils/functions";

export function Chats() {
    let chats = {chats: []};
    return (<div className={'chatContainer'}>
        <div className={'wrapper'}>
            {chats.hasOwnProperty('chats')
                ?
                <ConversationWrapper/>
                :
                <div className={'noChatContainer'}>
                    <div className={'emptyImage'}><img src={emptyChats} alt={'No Chats'}/></div>
                    <div className={'font-primary'}>{getString(2)}</div>
                </div>}
        </div>
    </div>)

}


function ConversationWrapper() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (messages.length) {
            ref.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [messages.length]);
    let tags = ['Mental Health', 'Breakup', 'Health', 'Sports','Literature']
    return (
        <div className={'convoPanel'}>
            <div className={'wrapperContainer'}>
                <div className={'infoPanel font-primary'}>{tags.map(item => (<div className={'itemTags'}>{item}</div>))}
                </div>
                <div className={'convoHistory'}>
                    {messages.map(item => (
                        <div ref={ref}
                            className={`messageWrapper ${item.message.from.user.name === 'Vipul Dev' && 'selfMessage'}`}>
                            <div className={'font-primary miscContainer'}>
                                <div className={`imageWrapper ${item.message.from.user.name === 'Vipul Dev' && 'selfMessageBubble'}`}>
                                    <img style={{height: '100%', width: '100%', borderRadius: '50%'}}
                                         src={item.message.from.user.image.url}/>
                                </div>
                                {(item.message.from.user.name !== 'Vipul Dev') && item.message.from.user.name}
                            </div>
                            <div className={'contentWrapper'}>
                                <div
                                    className={`messageBubble ${item.message.from.user.name === 'Vipul Dev' && 'selfMessageBubble'}  `}>
                                    {item.message.content}
                                </div>

                            </div>
                            <div className={'font-primary miscContainer '}>{formatTime(item.when)}</div>
                        </div>
                    ))}
                </div>
                <div ref={ref}></div>
                <div className={'optionsPanel'}>
                    <div><FcAddImage size={'2rem'} color={'green'}/></div>
                    <div className={'inputWrapper'}><input type={'text'} className={'sendInput'}
                                                           placeholder={'Type something here...'}/></div>
                    <div>
                        <div><IoSend size={'2rem'} color={'green'}/></div>
                    </div>
                </div>
            </div>
        </div>
    )
}


let arc: string = 'https://media.licdn.com/dms/image/D4D03AQG0Bn4rlDsoyw/profile-displayphoto-shrink_200_200/0/1690100247810?e=1699488000&v=beta&t=TaSkoY1Fs_mHg5eW9IRxMxHlRmnCS7t7n4DhKKGDL8E';
let messages =
    [{
        when: new Date(),
        message: {type: 'TEXT', content: 'Hey how are you', from: {user: {name: 'Kilo Dev', image: {url: arc}}}}
    },
        {
            when: new Date(),
            message: {
                type: 'TEXT',
                content: 'Hey how are you',
                from: {user: {name: 'Vipuwl Dev', image: {url: arc}}}
            }
        },
        {
            when: new Date(),
            message: {
                type: 'TEXT',
                content: 'Hey how are you',
                from: {user: {name: 'Vipuwl Dev', image: {url: arc}}}
            }
        },
        {
            when: new Date(),
            message: {
                type: 'TEXT',
                content: 'Hey ',
                from: {user: {name: 'Vipul Dev', image: {url: arc}}}
            }
        },
        {
            when: new Date(),
            message: {
                type: 'TEXT',
                content: 'Hey how are you',
                from: {user: {name: 'Saral Dev', image: {url: arc}}}
            }
        },
        {
            when: new Date(),
            message: {
                type: 'TEXT',
                content: 'Hey how are you',
                from: {user: {name: 'Vipul Dev', image: {url: arc}}}
            }
        },
        {
            when: new Date(),
            message: {
                type: 'TEXT',
                content: 'Hey how are you',
                from: {user: {name: 'David Dev', image: {url: arc}}}
            }
        },
        {
            when: new Date(),
            message: {
                type: 'TEXT',
                content: 'Hey how are you',
                from: {user: {name: 'Vipul Dev', image: {url: arc}}}
            }
        },
    ]


