import './index.css'
import emptyChats from './../../../assets/svg/empty-chats.svg'
import {getString} from "../../../utils/strings";
import {IoPersonAddSharp, IoSend} from "react-icons/io5";
import {FcAddImage} from "react-icons/fc";
import {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {_props, reqType, service, serviceRoute} from "../../../services/network/network";
import {ShellContext} from "../../../services/context/shell.context";
import groupsImg from './../../../assets/svg/groups.svg';
import {formatDateToDDMMYYYY, formatTimeToHHMM} from "../../../utils/functions";
import {Spinner} from "../../utility/spinner/spinner";
import {Role, SocketEmitters, SocketListeners} from "../../../utils/interface";
import {GiHamburgerMenu} from "react-icons/gi";
import {GroupOptions} from "../GroupsPanel/GroupOptions";
import sound from "./../../../assets/sound/notifications-sound.mp3";
import useSound from "use-sound";

export function Chats() {
    let [messages, _messages] = useState<any[]>([]);
    const [play] = useSound(sound);
    const [group, _group] = useState<{
        tags: string[],
        Socket: { id: number, socket_id: string },
        User: { name: string, email: string, profileImage: string }[]
    } | null>(null);
    const {groupId, socket, _socketId, socketId, requestId, _requestId, selectedGroupType} = useContext(ShellContext);
    const [loading, _loading] = useState<boolean>(false);
    const [activity, _activity] = useState<string>('');
    const [params, _params] = useState<{ start: Date, limit: number }>({
        start: new Date(),
        limit: 20
    })
    const [rId, _rId] = useState<string | undefined>(undefined);
    const [exceed, _exceed] = useState<boolean>(false);

    function handleSubmit(s: string) {
        socket?.emit(SocketEmitters._MESSAGE, {text: s});
    }

    useEffect(() => {
        window.setTimeout(() => {
            _activity('');
        }, 5000)
    }, [activity]);

    useEffect(() => {
        handleCurrentGroup();
        return () => {
            socket.off(SocketListeners.MESSAGE);
            socket.off(SocketListeners.TYPING);
        }
    }, [_socketId, groupId, requestId, selectedGroupType]);

    function handleCurrentGroup() {
        let gid = groupId;

        switch (selectedGroupType) {
            case "CHAT":
                let startDate = new Date();
                const _p = {start: startDate, limit: 20};
                _params({start: new Date(), limit: 20})
                if (gid && socketId) {
                    socket?.emit(SocketEmitters._DISCONNECT, {socketId: socketId})
                }
                if (gid) {
                    _activity('')
                    _loading(true);
                    _messages([]);
                    _group(null);
                    _props._db(service.group).query(serviceRoute.group, {}, reqType.get, gid)
                        .then(result => {
                            if (result.data) {
                                document.title = result.data.name;
                                _loading(false)
                                _group(result.data);
                                _socketId(result.data.Socket.socket_id);
                                socket?.connect();
                                socket?.emit(SocketEmitters._JOIN, {socketId: result.data.Socket.socket_id});
                            }
                        })
                    _props._db(service.group).query(serviceRoute._groupMessages, _p, reqType.post, gid)
                        .then(result => {
                            _loading(false);
                            _messages(result.data.reverse());
                            if (result.data.length === 0) {
                                _exceed(true);
                            } else {
                                _params({...params, start: result.data[0].created_at})
                            }
                        })
                    socket?.on(SocketListeners.MESSAGE, (data: any) => {
                        _activity('');
                        let user: any = window.localStorage.getItem('_user');
                        if (user) {
                            user = JSON.parse(user);
                            if (user.id !== data.senderId) {
                                play({forceSoundEnabled: true});
                            }
                        }
                        _messages((prevMessage) => {
                            if (prevMessage === null) {
                                return [data];
                            } else {
                                return [...prevMessage, data];
                            }
                        });
                    })

                    socket?.on(SocketListeners.TYPING, ({name}: { name: string }) => {
                        let user = window.localStorage.getItem('_user');
                        if (user) {
                            let u = JSON.parse(user);
                            if (group) {
                                const username = group.User.filter((item: {
                                    email: string;
                                    name: string
                                }) => item.email === name).map((item: {
                                    name: any;
                                }) => item.name).filter(item => item !== u.name);
                                if (username.length > 0) {
                                    _activity(username[0].toString().toUpperCase() + ' is Typing')
                                }

                            }
                        }
                    })

                }
                return
            case "INVITE":
                _rId(requestId);
                return
            default:
                return
        }

    }

    function refetch() {
        if (!exceed) {
            let limit = params.limit;
            let data = {start: params.start, limit}
            _props._db(service.group).query(serviceRoute._groupMessages, data, reqType.post, groupId)
                .then(result => {
                    console.log(result)
                    _loading(false);
                    _messages([...result.data.reverse(), ...messages]);
                    if (result.data.length === 0) {
                        _exceed(true);
                    } else {
                        _params({start: result.data[0].created_at, limit: limit})
                    }
                })
        }
    }

    return (<div className={'chatContainer shadow-box'}>
        <div className={'wrapper'}>
            {loading && <Spinner/>}
            {selectedGroupType === 'CHAT'
                &&
                <ConversationWrapper fetch={() => {
                    refetch()
                }} exceed={exceed} messages={messages} group={group} activity={activity} send={(s: string) => {
                    handleSubmit(s)

                }}/>}
            {selectedGroupType === 'INVITE' &&
                <InviteContainer requestId={rId}/>
            }
            {!selectedGroupType &&
                <div className={'noChatContainer'}>
                    <div className={'emptyImage'}><img src={emptyChats} alt={'No Chats'}/></div>
                    <div className={'font-primary'}>{getString(2)}</div>
                </div>
            }
        </div>
    </div>)
}

function InviteContainer(props: { requestId?: string, groupId?: string }) {
    const [loading, _loading] = useState<boolean>(true);
    const [data, _data] = useState<any>(null);
    const {_setGroupType, _setRefetch, refetch} = useContext(ShellContext);

    useEffect(() => {
        if (props.requestId) {
            _loading(true);
            _props._db(service.group).query(serviceRoute.request, {}, reqType.get, props.requestId)
                .then(result => {
                    _data(result.data);
                    _loading(false);
                })
        }
    }, [props.requestId, props.groupId]);

    function handleGroupJoin() {
        if (props.requestId) {
            _loading(true);
            _props._db(service.group).query(serviceRoute.request, {}, reqType.put, props.requestId)
                .then(() => {
                    _loading(false)
                    _setRefetch(!refetch)
                    _setGroupType('CHAT');
                })
        } else {
            // create a request to join this group
        }
    }

    function handleInviteReject() {
        _loading(true);
        _props._db(service.group).query(serviceRoute.groupInvite, {status: "REJECTED"}, reqType.put, props.requestId)
            .then(result => {
                _loading(false);
                _setRefetch(!refetch)
                _setGroupType(null);
            })
    }

    function handleRequestBlock() {
        _loading(true)
        _props._db(service.group).query(serviceRoute.groupInvite, {status: data.status === "BLOCKED" ? "PENDING" : "BLOCKED"}, reqType.put, props.requestId)
            .then(result => {
                _loading(false);
                _setRefetch(!refetch)
                _setGroupType(null);
            });
    }

    return (
        <div className={'inviteContainer'}>
            {loading ? <Spinner/> :
                <>
                    <div className={'inviteWrapper'}>
                        <div className={'invContainer'}>
                            <div className={'font-primary inviteHeading'}>Group Invitation</div>
                            <div className={'groupIcon_wrapper_container'}>
                                <div className={'groupIcon_wrapper'}>
                                    <img style={{
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: '50%',
                                        border: '1px solid lightgrey'
                                    }} src={data.group.GroupDetail.icon ? data.group.GroupDetail.icon : groupsImg}
                                         alt={'Group image'}/>
                                </div>
                            </div>
                            <div className={'label font-primary'}>NAME</div>
                            <div className={'font-secondary invite-labels'}> {data.group.name} </div>
                            <div className={'font-primary '}>DESCRIPTION</div>
                            <div className={'font-secondary invite-labels'}>{data.group.GroupDetail.description}</div>
                            <div className={'font-primary'}>TAGS</div>
                            <div className={'tag-container '}>{data.group.GroupDetail.tags.map((item: string) => {
                                return <div className={'tag'}>{item}</div>
                            })}
                            </div>
                            <div className={'font-primary'}>REQUESTER</div>
                            <div className={'font-secondary invite-labels'}>{data.user.name}</div>
                            <div style={{display: 'flex'}}>
                                <div className={'btn-Wrapper'}>
                                    {data.status !== "BLOCKED" && <>
                                        <div onClick={() => {
                                            handleInviteReject()
                                        }}
                                             className={'btn btn-primary btn-custom'}>{!props.requestId ? "NOT INTERESTED" : "NOT INTERESTED"}</div>

                                        <div onClick={() => {
                                            handleGroupJoin()
                                        }}
                                             className={'btn btn-primary btn-custom'}>{!props.requestId ? "JOIN" : "I AM INTERESTED"}</div>
                                    </>
                                    }
                                </div>


                                <div onClick={() => {
                                    handleRequestBlock()
                                }}
                                     className={'font-primary block-text'}>{data.status === "BLOCKED" ? "Unblock ?" : "Block ?"}
                                </div>

                            </div>

                        </div>
                    </div>
                </>
            }
        </div>
    )
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
        email: string,
        profileImage: string,
        id: number
    }
}

interface MessageContent {
    id: number,
    caption: null | string,
    content: string
}

export function ConversationWrapper({messages, group, activity, send, fetch, exceed}: {
    messages: MessageInterface[],
    group: any,
    activity: string,
    send: (s: string) => void,
    fetch: () => void,
    exceed: boolean
}) {
    const [state, setState] = useState<{ tags?: string[], messages: MessageInterface[] }>({
        messages: []
    });
    const {socket} = useContext(ShellContext);
    const [message, _message] = useState('');
    const [typing, _typing] = useState<boolean>(false);
    const [options, showOptions] = useState<boolean>(false);
    const [role, _role] = useState<Role | null>();
    const [init, setInit] = useState('members')
    const [idx, _idx] = useState<number>(0);
    const [isScrolling, _setScrolling] = useState<boolean>(false);
    const [loading, _loading] = useState<boolean>(false);


    useEffect(() => {
        _loading(false)
    }, [exceed]);

    useEffect(() => {
        if (group?.id) {
            _props._db(service.group).query(serviceRoute.groupRole, {}, reqType.get, group.id)
                .then((result: { data: Role }) => {
                    _role(result.data);
                })
        }
    }, [group?.id]);


    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        _message(e.target.value)
        if (!typing) {
            _typing(true);
            socket.emit(SocketEmitters._TYPING)
        }
    }

    function handleAddMore() {
        setInit('requests');
        showOptions(true);
    }

    useEffect(() => {
        if (typing) {
            window.setTimeout(() => {
                _typing(false);
            }, 1000)
        }
    }, [typing]);

    useEffect(() => {
        setState({...state, messages: messages})
        _loading(false)
    }, [messages]);

    function handleSubmit(e: any) {
        e.preventDefault();
        if (message.split('').length === 0) {
            return
        }
        send(message)
        _message('')
    }


    const containerRef = useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
        if (!isScrolling) {
            if (containerRef.current) {
                containerRef.current.scrollTo({
                    top: containerRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            }
        }

    };
    useEffect(() => {
        if (containerRef.current && !isScrolling) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, []);
    useEffect(() => {
        scrollToBottom();
    }, [state.messages]);
    const {userId} = useContext(ShellContext);
    const handleScroll = () => {
        _setScrolling(true);
        if (containerRef.current?.scrollTop === 0) {
            _loading(true);
            window.setTimeout(() => {
                fetch();
            }, 1000)
        }
        if (containerRef.current) {
            if (containerRef?.current?.scrollHeight - containerRef?.current?.scrollTop === containerRef.current?.clientHeight) {
                _setScrolling(false);
            }
        }
    };

    return (
        <div className={'convoPanel'}>
            {!options ?
                <div className={'wrapperContainer'}>
                    <div className={'tagsWrapper'}>
                        <div className={'tagsWrapperName'}>{group?.name}</div>
                        <div style={{flex: 8, position: 'relative', width: '80%'}}>
                            <div className={'infoPanel font-primary'}>{group?.User.map((item: {
                                name: string,
                                email: string,
                                profileImage: string
                            }, index: number) => (
                                <div className={'usernamewrapper'} key={index}>
                                    <div className={'usernameImage'}>
                                        <img
                                            src={item?.profileImage.split('').length > 0 ? item.profileImage : groupsImg}
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
                                {(role?.type === 'OWNER') &&
                                    <div className={'usernamewrapper addMoreBtn'} onClick={() => {
                                        handleAddMore()
                                    }}>
                                        <IoPersonAddSharp size={22}/>
                                    </div>
                                }
                            </div>
                        </div>
                        <div style={{padding: '4px 8px', width: '6%'}}>
                            <GiHamburgerMenu size={24} color={'white'} onClick={() => {
                                showOptions(true)
                            }} style={{cursor: 'pointer'}}/>
                        </div>
                    </div>
                    <div style={{textAlign: 'center'}} className={
                        'font-primary'
                    }>{activity}</div>
                    <div className={'convoHistory'} ref={containerRef} onScroll={handleScroll}>
                        {loading && <div style={{position: 'relative', marginBottom: '30px'}}><Spinner/></div>}
                        {state.messages?.map((item: MessageInterface, index: number) => {
                            return <>
                                {((formatDateToDDMMYYYY(item.created_at) !== formatDateToDDMMYYYY(state.messages[index ? index - 1 : index].created_at) || (!index)) &&
                                    <div className={'w100 message-text-wrapper'}>
                                        <div className={'chatDate'}> {formatDateToDDMMYYYY(item.created_at)}</div>
                                    </div>)}
                                <div key={index}
                                     className={`messageWrapper ${item?.senderId === userId && 'selfMessage'}`}>
                                    <div className={'font-primary miscContainer'}>
                                        {(item.senderId !== userId && item.senderId !== state.messages[index ? index - 1 : index].senderId) &&
                                            <div
                                                className={`imageWrapper ${item?.senderId === userId && 'selfMessageBubble'}`}>
                                                <img style={{height: '100%', width: '100%', borderRadius: '50%'}}
                                                     src={item.User?.profileImage.split('').length > 0 ? item.User.profileImage : groupsImg}/>
                                            </div>

                                        }
                                        {(item?.senderId !== userId && item.senderId !== state.messages[index ? index - 1 : index].senderId) && item?.User.name.toUpperCase()}
                                    </div>
                                    <div className={'contentWrapper'}>
                                        <div
                                            className={`messageBubble ${item?.senderId === userId && 'selfMessageBubble'}  `}>
                                            {((item.senderId !== state.messages[index ? index - 1 : index].senderId) || (!index) || (formatDateToDDMMYYYY(item.created_at) !== formatDateToDDMMYYYY(state.messages[index ? index - 1 : index].created_at) || (!index))) &&
                                                <div
                                                    className={`arrow ${item.senderId === userId ? 'arrow-right' : 'arrow-left'}`}></div>
                                            }
                                            {item?.MessageContent?.content}
                                            <div className={'font-primary miscContainer '} style={{
                                                display: 'flex',
                                                justifyContent: item.senderId === userId ? 'end' : 'start',
                                                color: item.senderId !== userId ? 'black' : 'whitesmoke'
                                            }}>{formatTimeToHHMM(item.created_at)}</div>

                                        </div>
                                    </div>

                                </div>
                            </>
                        })}
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
                                <IoSend size={'2rem'} color={message.split('').length > 0 ? '#398378' : 'grey'}
                                        onClick={handleSubmit}/>
                            </div>

                        </div>
                    </form>
                </div>
                : <>
                    <GroupOptions groupId={group.id} role={role?.type} init={init} showChat={() => {
                        showOptions(false)
                    }}/>
                </>}
        </div>
    )
}





