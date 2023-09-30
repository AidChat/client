import './index.css'
import emptyChats from './../../../assets/svg/empty-chats.svg'
import {getString} from "../../../utils/strings";
import {IoSend} from "react-icons/io5";
import {FcAddImage} from "react-icons/fc";
import {formatTime} from "../../../utils/functions";

export function Chats() {
    let chats = {};
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


export function ConversationWrapper() {
    let tags: string[] = []
    let messages: any[] = [];
    return (
        <div className={'convoPanel'}>
            <div className={'wrapperContainer'}>
                <div className={'infoPanel font-primary'}>{tags.map(item => (<div className={'itemTags'}>{item}</div>))}
                </div>
                <div className={'convoHistory'}>
                    {messages.map((item,index) => (
                        <div key={index}
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
                <div ></div>
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





