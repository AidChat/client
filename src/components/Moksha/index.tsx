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
    storeChatsByDeviceID, timeAgo,
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
import {useWindowSize} from "../../services/hooks/appHooks";
import {ProfileIconComponent} from "../ProfileDialog";
import {Seeker} from "./Seeker";
import {Socket} from "socket.io-client";


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
    const [currentUser, setCurrentUser] = useState<UserProps | null>(null);
    const ac = useContext(AppContext);
    const [aiderAssigned, setAiderAssigned] = useState<boolean>(false);
    const [socket, setSocket] = useState<Socket | null | undefined>(ac?.mokshaSocket);
    const [groupId, setGroupId] = useState<string>("");
    const [aider, setAider] = useState<any>(null);
    const [listenerAvailable, setListenerAvailable] = useState<boolean>(false);
    useEffect(() => {
        window.setTimeout(function () {
            setShowInfo(false);
        }, 3000)
    }, []);


    useEffect(() => {
        scrollToBottom(scrollableDivRef);
        setShowInfoBox(true);
        window.setTimeout(() => {
            // setShowInfoBox(false);
        }, 5000)
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
        console.log(data);
        setConversation(data.chats);

    }


    function addConversationMessages(payload: Message) {
        setConversation(prevConversation => [...prevConversation, payload]);
    }

    useEffect(() => {
        if (conversation.length > 1) {
            storeChatsByDeviceID(conversation);
        }
    }, [conversation]);

    async function handleSocketMessageSend() {
        if (validateAskText(message).isValid) {
            if (aiderAssigned) {
                socket?.emit(SocketEmitters._MESSAGE, {text: message, groupId, images: []});
                setMessage('')
            } else {
                let device = await getDeviceID();
                let payload = {
                    deviceId: device.identifier,
                    message: message,
                };
                ac?.mokshaSocket?.emit(SocketEmitters._ASK, payload);
                addConversationMessages({sender: "User", message: message,created_at: new Date()});
                setMessage("");
                scrollToBottom(scrollableDivRef);
            }

        }
    }

    function handleSocketListener(e: any) {
        vibrateDevice().then(function () {
            addConversationMessages({sender: "Model", message: e.message,created_at:new Date()});
        })
    }

    useEffect(() => {
        scrollToBottom(scrollableDivRef);
    }, [conversation]);
    useEffect(() => {
        // startLogger({interval: 30000});
        queryStoreObjects(IDBStore.chat).then(function (data: any) {
            if (data && data[0]?.chats) {
                renderChatOrder(data[0]);
                setMessage("");
            }
        });

    }, []);

    useEffect(() => {
        _props._user().get().then(function (data: UserProps) {
            setCurrentUser(data)
            toggleLoginComponent(true);
            fetchOldRequests();

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
        _props._db(service.group).query(serviceRoute.groupRequests, undefined, reqType.get, undefined)
            .then(function ({data}) {
                if (isAiderAssigned(data)) {
                    console.log("Aider has been assigned");
                    console.log('%c-------- Connecting to aider now----------', 'color: green;')
                    setGroupId(data.id);
                    setAiderAssigned(true);
                    setSocket(prevState => ac?.chatSocket);

                } else {
                    if (data.Request?.length > 0) {
                        setCurrentUserGroup(data);
                    } else {
                        setCurrentUserGroup(null)
                    }
                }
            })
            .catch(e => {
                console.error(e)
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
            async (data: {senderId: any; id: any}) => {
                console.log('new message',data)
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


    let {size: isSmall} = useWindowSize(EwindowSizes.S);

    return (
        <>
            <ConfirmDialog/>
            {showInfoBox && currentUserGroup && <Seeker group={currentUserGroup} refetch={() => fetchOldRequests()}/>}
            <Snackbar message={error} onClose={() => setError("")}/>
            <div className="confession">
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
                                    className={"font-primary m4 chat-wrapper"}>
                                    {text.sender === "User" &&
                                        <span style={{color: "lightyellow"}}>{}</span>}
                                    {text.sender === "Model" &&
                                        <span className={"font-secondary font-thick"}>{`${getString(24)} :`} <span className={'font-primary font-small '}>{timeAgo(text?.created_at)}</span></span>}
                                    <Markdown className={'m0 font-large'}>
                                        {text.message}
                                    </Markdown>
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
                                image={aider ? aider.profileImage : undefined}
                                aider={aider ? aider.Username : undefined}
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
