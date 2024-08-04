import React, {useContext, useEffect, useRef, useState} from "react";
import {Input} from "../Utils/CustomInput";
import "./index.css";
import {PiPaperPlaneTiltFill} from "react-icons/pi";
import {EwindowSizes, IDBStore, reqType, service, serviceRoute} from "../../utils/enum";
import {
    clearDatabaseByName,
    confirm,
    getDeviceID,
    notify,
    queryStoreObjects,
    storeChatsByDeviceID,
    timeAgo,
    validateAskText,
    vibrateDevice,
} from "../../utils/functions";
import Snackbar from "../Utils/Snackbar";
import {motion} from "framer-motion";
import moksha from "./../../assets/png/moksha.png";
import {getString} from "../../utils/strings";
import {Message, SocketEmitters, SocketListeners, UserProps} from "../../utils/interface";
import {MdDeleteOutline} from "react-icons/md";
import {MokshaIcon} from "./Icon";
import {AppContext} from "../../services/context/app.context";
import {ConfirmDialog} from "primereact/confirmdialog";
import Markdown from "react-markdown";
import {_props} from "../../services/network/network";
import {useWindowSize} from "../../services/hooks";
import {ProfileIconComponent} from "../ProfileDialog";
import {Seeker} from "./Seeker";
import {Socket} from "socket.io-client";
import {Spinner} from "../Utils/Spinner/spinner";


interface Props {
    click: () => void;
}

export const ClientChatWindow = (props: Props) => {
    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState("Hi Moksha!");
    const [conversation, setConversation] = useState<Message[]>([]);
    const scrollableDivRef = useRef<HTMLDivElement>(null);
    const [showLoginComponent, toggleLoginComponent] = useState(false);
    const [showInfo, setShowInfo] = useState(true);
    const [showInfoBox, setShowInfoBox] = useState(false);
    const [currentUserGroup, setCurrentUserGroup] = useState(null);
    const ac = useContext(AppContext);
    const [aiderAssigned, setAiderAssigned] = useState<boolean>(false);
    const [socket, setSocket] = useState<Socket | null | undefined>(ac?.mokshaSocket);
    const [groupId, setGroupId] = useState<string>("");
    const [aider, setAider] = useState<any>(null);
    const [switchToMoksha, setSwitchToMoksha] = useState<boolean>(false);
    const [listenerAvailable, setListenerAvailable] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        window.setTimeout(function () {
            setShowInfo(false);
        }, 3000)
    }, []);


    useEffect(() => {
        scrollToBottom(scrollableDivRef);
        setShowInfoBox(true);
        fetchOldRequests();
        return () => {
            if (ac?.mokshaSocket) ac?.mokshaSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!ac?.mokshaSocket?.connected) {
            ac?.mokshaSocket?.connect();
        }
        if (ac?.mokshaSocket?.connected) {
            ac.mokshaSocket.on(SocketListeners.REPLY, handleSocketListener);
        }
    }, [ac?.mokshaSocket?.connected]);

    function handleSocketMessageUpdate(m: string) {
        setMessage(m);
    }

    function renderChatOrder(data: any) {
        console.log(data)
        setConversation(data);
    }


    async function addConversationMessages(payload: Message) {
        setConversation(prevConversation => [...prevConversation, payload]);
        await storeChatsByDeviceID(conversation);
    }


    async function handleSocketMessageSend() {
        if (validateAskText(message).isValid) {
            if (aiderAssigned && !switchToMoksha) {
                socket?.emit(SocketEmitters._MESSAGE, {text: message, groupId, images: []});
                setMessage('')
            } else {
                let device = await getDeviceID();
                _props._user().get().then(function (user) {
                    let payload = {
                        deviceId: device.identifier,
                        message: message,
                        userId: user.id,
                    };
                    ac?.mokshaSocket?.emit(SocketEmitters._ASK, payload);
                    addConversationMessages({sender: "User", message: message, created_at: new Date()});
                    setMessage("");
                    scrollToBottom(scrollableDivRef);
                    storeChatsByDeviceID(conversation);
                }).catch(e => {
                    // unauthenticated case
                    let payload = {
                        deviceId: device.identifier,
                        message: message,
                    };
                    ac?.mokshaSocket?.emit(SocketEmitters._ASK, payload);
                    addConversationMessages({sender: "User", message: message, created_at: new Date()});
                    setMessage("");
                    scrollToBottom(scrollableDivRef);
                })


            }

        }
    }

    function handleSocketListener(e: any) {
        vibrateDevice().then(function () {
            addConversationMessages({sender: "Model", message: e.message, created_at: new Date()});

        })
    }

    useEffect(() => {
        scrollToBottom(scrollableDivRef);
    }, [conversation]);


    useEffect(() => {
        _props._user().get().then(async function (data: UserProps) {
            toggleLoginComponent(true);
            ac?.globalSocket?.on(SocketListeners.JOINREQUEST, function (data: any) {
                notify("Someone is looking to help you")
                setCurrentUserGroup(data);
            })
        })
            .catch(error => {
                console.error(error)
                toggleLoginComponent(false);
            })
    }, [ac?.globalSocket]);

    function fetchOldRequests() {
        console.log("fetchOldRequests")
        _props._db(service.group).query(serviceRoute.groupRequests, undefined, reqType.get, undefined)
            .then(function ({data}) {
                handleMessagesSync(data.id);
                setGroupId(data.id);
                if (isAiderAssigned(data)) {
                    console.log("Aider has been assigned");
                    console.log('%c-------- Connecting to aider now----------', 'color: green;')
                    setAiderAssigned(true);
                    setSocket(prevState => ac?.chatSocket);
                } else {
                    if (data.Request?.length > 0) {
                        setCurrentUserGroup(data);
                        setSocket(ac?.mokshaSocket);
                        setAider(null);
                        setAiderAssigned(false);
                    } else {
                        setCurrentUserGroup(null);
                        setSocket(ac?.mokshaSocket);
                        setAider(null)
                        setAiderAssigned(false)
                    }
                }
            })
            .catch(e => {
                console.error(e)
                handleMessagesSync();
            })

    }

    useEffect(() => {
        socket?.connect();
        if (aiderAssigned && groupId) {
            socket?.emit(SocketEmitters._JOIN, {groupId});
        }
        socket?.on(SocketListeners.USERONLINE, (data: { user: number }) => {
            console.log('%c-------- Aider is online----------', 'color: green;');
            setListenerAvailable(true);
        });
        ac?.chatSocket?.on(
            SocketListeners.MESSAGE,
            async (data: { senderId: any; id: any }) => {
                console.log(data)
            });

        ac?.chatSocket?.on(
            SocketListeners.MESSAGE,
            async (data: { senderId: any; id: any }) => {
                console.log('new message', data)
            })

    }, [socket, groupId]);

    function isAiderAssigned(data: any): boolean {
        let assigned = false;
        data?.User?.forEach((user: UserProps) => {
            if (user.Type === 'Helper') {
                setAider(user);
                assigned = true
            }

        })
        return assigned;
    }

    function scrollToBottom(ref: React.RefObject<HTMLDivElement>): void {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }

    function handleMessagesSync(groupId?: number) {
        queryStoreObjects(IDBStore.chat).then(async function (data: any) {
            let storedChats = data[0].chats;
            try {
                if (groupId) {
                    const {data} = await _props._db(service.group).query(serviceRoute._groupMessages, {
                        limit: 20,
                        start: new Date()
                    }, reqType.post, groupId);
                    const dbChats = data.filter((item: { analysis: any; })=> !item.analysis).map((chat: any) => {

                        return {
                            message: chat?.MessageContent?.content,
                            created_at: chat.created_at,
                            sender: chat?.User?.Username === aider.Username ? 'Helper' : 'User',
                            id: chat.id
                        }
                    })

                    storedChats = [...storedChats, ...dbChats].sort(function (a: { created_at: number; }, b: {
                        created_at: number;
                    }) {
                        return a.created_at - b.created_at
                    });
                    console.log(storedChats)
                    renderChatOrder(storedChats);
                    setMessage("");
                    setLoading(false);
                } else {
                    renderChatOrder(storedChats);
                    setMessage("");
                    setLoading(false);
                }

            } catch (e) {
                renderChatOrder(storedChats);
                setMessage("");
                setLoading(false);
            }

        });
    }

    let {size: isSmall} = useWindowSize(EwindowSizes.S);

    return (
        <>
            <ConfirmDialog/>
            {showInfoBox && currentUserGroup && <Seeker group={currentUserGroup} refetch={() => fetchOldRequests()}/>}
            <Snackbar message={error} onClose={() => setError("")}/>
            <div className="confession">
                {loading ? <Spinner/> : <>
                    {showLoginComponent && <ProfileIconComponent full={isSmall}/>}
                    <div className={"chat-history-container"} ref={scrollableDivRef}>
                        {!conversation.length
                            ? renderEmptyMessageConversation()
                            : conversation.map((text, index) => (
                                <>
                                    <motion.div
                                        initial={{y: 10}}
                                        animate={{y: 0}}
                                        transition={{speed: 2}}
                                        key={index}
                                        className={`font-primary m4 chat-wrapper ${text.sender === 'User' && 'text-right'} `}>
                                        {text.sender === "User" &&
                                            <span style={{color: "lightyellow"}}>{}</span>}
                                        {text.sender === "Model" &&
                                            <span
                                                className={"font-secondary font-thick"}>{`${getString(24)} :`} </span>}
                                        {text.sender === "Helper" &&
                                            <span
                                                className={"font-secondary font-thick"}>{`${aider.Username} :`} </span>}

                                        <Markdown
                                            className={`m0 font-large text-left font-thick ${text.sender === 'User' && ' text-right font-secondary '}`}>
                                            {text.message}
                                        </Markdown>
                                        <span
                                            className={'font-primary font-small '}>{timeAgo(text?.created_at)}</span>
                                        {text.sender === "Model" && (
                                            <div

                                                className={"font-primary font-thick reportBtn"}
                                            >
                                           <span onClick={async () => {
                                               let accepted = await confirm({
                                                   message:
                                                       "Do you wanna report this reply from Moksha?",
                                                   header: "Confirmation",
                                               });
                                           }}> Report</span>

                                            </div>

                                        )}


                                    </motion.div>
                                    <div className={"dotted-border"}></div>
                                </>
                            ))}

                    </div>
                    <div className={"confession_container"}>
                        <div className={"h100 flex center  justify-center clear"}>
                            <MdDeleteOutline
                                color={"whitesmoke"}
                                size={22}
                                onClick={async () => {
                                    let accepted = await confirm({
                                        message: "Do you wanna remove the messages?",
                                        header: "Confirmation",
                                    });
                                    if (accepted) {
                                        clearDatabaseByName(IDBStore.chat).then(function () {
                                            setConversation([]);
                                        });
                                    }
                                }}
                            />
                        </div>

                        <Input
                            width={showLoginComponent ? "100%" : undefined}
                            height={"50px"}
                            borderRadius={"50px"}
                            textColor={"gray"}
                            placeholder={
                                "How are you feeling."
                            }
                            allowToggle={false}
                            disabled={false}
                            icon={message.split('').length > 0 ? <PiPaperPlaneTiltFill size={22} color={"#398378"}/> :
                                <MokshaIcon
                                    online={!!ac?.isMokshaAvailable || listenerAvailable}
                                    size={"small"}
                                    bottom={true}
                                    right={true}
                                    showInfo={showInfo}
                                    image={aider && !switchToMoksha ? aider.profileImage : undefined}
                                    aider={aider && !switchToMoksha ? aider.Username : undefined}
                                    id={aider?.id}
                                    requestedSwitch={() => {
                                        setSwitchToMoksha(true);
                                        setSocket(ac?.mokshaSocket);
                                    }}
                                    removeAider={() => {
                                        fetchOldRequests();
                                    }}

                                />}
                            type={"text"}
                            onChange={e => handleSocketMessageUpdate(e.target.value)}
                            inputName={"confession"}
                            send={handleSocketMessageSend}
                            listenSubmit={true}
                            value={message}
                        />
                        {!showLoginComponent && <div className={"btncontainer pointer"}>
                            <div className={"font-primary"}>Or</div>
                            <div
                                className={"loginbtn font-primary font-thick"}
                                onClick={props.click}
                            >
                                Login
                            </div>
                        </div>}

                    </div>
                </>
                }
            </div>
        </>
    );
};

function renderEmptyMessageConversation() {
    return (
        <div className={"emptycontainer font-primary"}>
            <div className={" container-ele-wrapper"}>
                <div className={"moksha-container"}>
                    <img
                        src={moksha}
                        alt={"mokasha-image"}
                        height={"100%"}
                        width={"100%"}
                        style={{objectFit: "contain"}}
                        loading={'eager'}
                    />
                </div>
                <div className={"text-container"}>
                    <p>Hey,</p>
                    <h4>
                        I am <span className={"font-secondary"}>{getString(24)}</span>
                    </h4>
                </div>
            </div>
        </div>
    );
}
