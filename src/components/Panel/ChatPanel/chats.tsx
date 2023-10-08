import './index.css'
import emptyChats from './../../../assets/svg/empty-chats.svg'
import {getString} from "../../../utils/strings";
import {IoSend} from "react-icons/io5";
import {FcAddImage} from "react-icons/fc";
import {useContext, useEffect, useState} from "react";
import {_props, reqType, service, serviceRoute} from "../../../services/network";
import {ShellContext} from "../../../services/context/shell.context";
import groupsImg from './../../../assets/svg/groups.svg';
import {formatTime} from "../../../utils/functions";
import {Spinner} from "../../utility/spinner/spinner";

export function Chats() {
    let [messages, _messages] = useState<MessageInterface[] | null>(null);
    const [group, _group] = useState<{ tags: string[] }>();
    const {groupId} = useContext(ShellContext);
    const [loading,_loading] = useState<boolean>(false);
    useEffect(() => {
        if (groupId) {
            _loading(true);
            _messages(null);
            _group(undefined)
            _props._db(service.group).query(serviceRoute.group, {}, reqType.get, groupId)
                .then(result => {
                    _loading(false)
                    _group(result.data);
                })
            _props._db(service.group).query(serviceRoute._groupMessages, {}, reqType.get, groupId)
                .then(result => {
                    _loading(false);
                    _messages(result.data);
                })
        }
    }, [groupId]);
    return (<div className={'chatContainer shadow-box'}>
        <div className={'wrapper'}>
            {messages
                ?
                <ConversationWrapper messages={messages} group={group}/>
                :
                loading ? <Spinner />:
                <div className={'noChatContainer'}>
                    <div className={'emptyImage'}><img src={emptyChats} alt={'No Chats'}/></div>
                    <div className={'font-primary'}>{getString(2)}</div>
                </div>}
        </div>
    </div>)
}

interface MessageInterface {
    MessageContent: MessageContent
    created_at: string,
    groupId: number,
    id: number,
    messageContentId: number,
    senderId: number,
    status: string,
}

interface MessageContent {
    id: number,
    caption: null | string,
    content: string
}

export function ConversationWrapper({messages, group}: {
    messages: MessageInterface[],
    group: any,
}) {
    const [state, setState] = useState<{ tags?: string[], messages: MessageInterface[] }>({
        messages
    })
    const {userId} = useContext(ShellContext);
    return (
        <div className={'convoPanel'}>
            <div className={'wrapperContainer'}>
                <div className={'tagsWrapper'}>
                    <div className={'tagsWrapperName'}>{group?.name}</div>
                    <div style={{width: '100%', flex: 8, position: 'relative'}}>
                        <div className={'infoPanel font-primary'}>{group?.User.map((item: {
                            name: string,
                            email: string
                        }) => (
                            <div className={'usernamewrapper'}>
                                <div className={'usernameImage'}>
                                    <img src={groupsImg} style={{height: '100%', width: '100%', borderRadius: "50%"}}
                                         alt={'user-image'}/>
                                </div>
                                <div className={'username tooltip-selector'}>
                                    {item.name.toUpperCase()}
                                    <div id="tooltip" className="left">
                                        <div className={"tooltip-arrow"}/>
                                        <div className={"tooltip-label"}>{item.email}</div>
                                    </div>
                                </div>
                            </div>))}
                            <div className={'usernamewrapper addMoreBtn'}>
                                + Add More
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'convoHistory'}>
                    {state.messages?.map((item: MessageInterface, index: number) => (
                        <div key={index}
                             className={`messageWrapper ${item?.senderId === userId && 'selfMessage'}`}>
                            <div className={'font-primary miscContainer'}>
                                <div
                                    className={`imageWrapper ${item?.senderId === userId && 'selfMessageBubble'}`}>
                                    <img style={{height: '100%', width: '100%', borderRadius: '50%'}}
                                         src={groupsImg}/>
                                </div>
                                {(item?.senderId === userId) && item?.senderId}
                            </div>
                            <div className={'contentWrapper'}>
                                <div
                                    className={`messageBubble ${item?.senderId === userId && 'selfMessageBubble'}  `}>
                                    {item?.MessageContent?.content}
                                </div>

                            </div>
                            <div className={'font-primary miscContainer '}>{formatTime(item.created_at)}</div>
                        </div>
                    ))}
                </div>
                <div></div>
                <div className={'optionsPanel'}>
                    <div><FcAddImage size={'2rem'} color={'#398378'}/></div>
                    <div className={'inputWrapper'}><input type={'text'} className={'sendInput'}
                                                           placeholder={'Type something here...'}/></div>
                    <div>
                        <div><IoSend size={'2rem'} color={'#398378'}/></div>
                    </div>
                </div>
            </div>
        </div>
    )
}





