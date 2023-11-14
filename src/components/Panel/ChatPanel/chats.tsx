import './index.css'
import emptyChats from './../../../assets/svg/empty-chats.svg'
import {getString} from "../../../utils/strings";
import {IoSend} from "react-icons/io5";
import {FcAddImage} from "react-icons/fc";
import {
    ChangeEvent,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import {_props, reqType, service, serviceRoute} from "../../../services/network/network";
import {ShellContext} from "../../../services/context/shell.context";
import groupsImg from './../../../assets/svg/groups.svg';
import {formatTime} from "../../../utils/functions";
import {Spinner} from "../../utility/spinner/spinner";
import {SocketEmitters, SocketListeners} from "../../../utils/interface";
import {GiHamburgerMenu} from "react-icons/gi";
import {GroupOptions} from "../GroupsPanel/GroupOptions";


export function Chats() {
    let [messages, _messages] = useState<any[] | null>(null);
    const [group, _group] = useState<{
        tags: string[],
        Socket: { id: number, socket_id: string },
        User: { name: string, email: string }[]
    } | null>(null);
    const {groupId, socket, _socketId, socketId} = useContext(ShellContext);
    const [loading, _loading] = useState<boolean>(false);
    const [activity, _activity] = useState<string>('');

    function handleSubmit(s: string) {
        socket?.emit(SocketEmitters._MESSAGE, {text: s});
    }

    useEffect(() => {
        window.setTimeout(() => {
            _activity('');
        }, 5000)
    }, [activity]);

    useEffect(() => {
        if (groupId && socketId) {
            socket?.emit(SocketEmitters._DISCONNECT, {socketId: socketId})
        }
        if (groupId) {
            _activity('')
            _loading(true);
            _messages(null);
            _group(null);
            _props._db(service.group).query(serviceRoute.group, {}, reqType.get, groupId)
                .then(result => {
                    _loading(false)
                    _group(result.data);
                    _socketId(result.data.Socket.socket_id);
                    socket?.connect();
                    socket?.emit(SocketEmitters._JOIN, {socketId: result.data.Socket.socket_id});
                })
            _props._db(service.group).query(serviceRoute._groupMessages, {}, reqType.get, groupId)
                .then(result => {
                    _loading(false);
                    _messages(result.data);
                })


            socket?.on(SocketListeners.MESSAGE, (data: any) => {
                _messages((prevMessage) => {
                    if (prevMessage === null) {
                        return [data];
                    } else {
                        return [...prevMessage, data];
                    }
                });
            })

            socket?.on(SocketListeners.TYPING, ({name}: { name: string }) => {
                if (group) {
                    const username = group.User.filter((item: { email: string; }) => item.email == name).map((item: {
                        name: any;
                    }) => item.name)
                    _activity(username.toString().toUpperCase() + ' is Typing')
                }

            })
        }
        return () => {
            socket.off(SocketListeners.MESSAGE);
            socket.off(SocketListeners.TYPING);
        }
    }, [groupId]);

    return (<div className={'chatContainer shadow-box'}>
        <div className={'wrapper'}>
            {messages
                ?
                <ConversationWrapper messages={messages} group={group} activity={activity} send={(s: string) => {
                    handleSubmit(s)
                }}/>
                :
                loading ? <Spinner/> :
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
    User: {
        name: string,
        email: string
    }
}

interface MessageContent {
    id: number,
    caption: null | string,
    content: string
}

export function ConversationWrapper({messages, group, activity, send}: {
    messages: MessageInterface[],
    group: any,
    activity: string,
    send: (s: string) => void
}) {
    const [state, setState] = useState<{ tags?: string[], messages: MessageInterface[] }>({
        messages
    });
    const {socket} = useContext(ShellContext);
    const [message, _message] = useState('');
    const [typing, _typing] = useState<boolean>(false);
    const [options, showOptions] = useState<boolean>(false)

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        _message(e.target.value)
        if (!typing) {
            _typing(true);
            socket.emit(SocketEmitters._TYPING)
        }
    }

    useEffect(() => {
        if (typing) {
            window.setTimeout(() => {
                _typing(false);
            }, 1000)
        }
    }, [typing]);

    useEffect(() => {
        setState({messages: messages})
    }, [messages]);

    function handleSubmit(e: any) {
        e.preventDefault();
        if(message.split('').length == 0){
            return
        }
        send(message)
        _message('')
    }



    const containerRef = useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, []);
    useEffect(() => {
        scrollToBottom();
    }, [state.messages]);

    const {userId} = useContext(ShellContext);
    return (
        <div className={'convoPanel'}>
            {!options ?
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
                                        <img src={groupsImg}
                                             style={{height: '100%', width: '100%', borderRadius: "50%"}}
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
                        <div style={{marginRight: ' 18px'}}>
                            <GiHamburgerMenu size={24} color={'white'} onClick={()=>{showOptions(true)}} style={{cursor: 'pointer'}}/>
                        </div>
                    </div>
                    <div style={{textAlign: 'center'}} className={
                        'font-primary'
                    }>{activity}</div>
                    <div className={'convoHistory'} ref={containerRef}>
                        {state.messages?.map((item: MessageInterface, index: number) => (
                            <div key={index}
                                 className={`messageWrapper ${item?.senderId === userId && 'selfMessage'}`}>
                                <div className={'font-primary miscContainer'}>
                                    <div
                                        className={`imageWrapper ${item?.senderId === userId && 'selfMessageBubble'}`}>
                                        <img style={{height: '100%', width: '100%', borderRadius: '50%'}}
                                             src={groupsImg}/>
                                    </div>
                                    {(item?.senderId != userId) && item?.User.name.toUpperCase()}
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
                    <form onSubmit={handleSubmit}>
                        <div className={'optionsPanel'}>

                            <div><FcAddImage size={'2rem'} color={'#398378'}/></div>
                            <div className={'inputWrapper'}><input onChange={handleChange} name={'message'}
                                                                   type={'text'}
                                                                   className={'sendInput'}
                                                                   placeholder={'Type something here...'}
                                                                   value={message}/>
                            </div>
                            <div>
                                <IoSend size={'2rem'} color={message.split('').length > 0 ? '#398378' : 'grey'} onClick={handleSubmit}/>
                            </div>

                        </div>
                    </form>
                </div>
                : <>
<GroupOptions groupId={group.id} showChat={()=>{showOptions(false)}} />
                </>}
        </div>
    )
}





