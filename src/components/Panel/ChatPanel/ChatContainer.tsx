import {MessageInterface, Role, SocketEmitters, SocketListeners} from "../../../utils/interface";
import {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {ShellContext} from "../../../services/context/shell.context";
import {useWindowSize} from "../../../services/hooks/appHooks";
import {EwindowSizes, reqType, service, serviceRoute} from "../../../utils/enum";
import {_props} from "../../../services/network/network";
import Tooltip from "../../Utils/Tooltip";
import groupsImg from "../../../assets/png/defaultuser.png";
import {IoPersonAddSharp, IoSend} from "react-icons/io5";
import {GiHamburgerMenu} from "react-icons/gi";
import {Spinner} from "../../Utils/Spinner/spinner";
import {formatDateToDDMMYYYY} from "../../../utils/functions";
import {motion} from "framer-motion";
import {FcAddImage} from "react-icons/fc";
import {GroupOptions} from "../GroupsPanel/GroupOptions";
import {RecipientReadStatus} from "./RecipientReadStatus";

export function ChatContainer({
                                  messages, group, activity, send, fetch, exceed, onliners, setOnliners,
                              }: {
    messages: MessageInterface[];
    group: any;
    activity: string;
    send: (s: string) => void;
    fetch: () => void;
    exceed: boolean;
    onliners: number[];
    setOnliners: (id: number) => void;
}) {
    const [state, setState] = useState<{
        tags?: string[]; messages: MessageInterface[];
    }>({
        messages: [],
    });
    const {socket} = useContext(ShellContext);
    const [message, _message] = useState("");
    const [typing, _typing] = useState<boolean>(false);
    const [options, showOptions] = useState<boolean>(false);
    const [role, _role] = useState<Role | null>();
    const [init, setInit] = useState("members");
    const [isScrolling, _setScrolling] = useState<boolean>(false);
    const [loading, _loading] = useState<boolean>(false);
    const [recentOffline, setRecentOffline] = useState<number[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const {size: valid} = useWindowSize(EwindowSizes.S);

    useEffect(() => {
        _loading(false);
    }, [exceed]);

    useEffect(() => {
        showOptions(false);

        if (group?.id) {
            _props
                ._db(service.group)
                .query(serviceRoute.groupRole, {}, reqType.get, group.id)
                .then((result: { data: Role }) => {
                    _role(result.data);
                });
        }
    }, [group?.id]);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        _message(e.target.value);
        if (!typing) {
            _typing(true);
            socket.emit(SocketEmitters._TYPING);
        }
    }

    function handleAddMore() {
        setInit("requests");
        showOptions(true);
    }

    useEffect(() => {
        if (typing) {
            window.setTimeout(() => {
                _typing(false);
            }, 1000);
        }
    }, [typing]);

    useEffect(() => {
        setState({...state, messages: messages});
        _loading(false);
    }, [messages]);

    function handleSubmit(e: any) {
        e.preventDefault();
        if (message.split("").length === 0) {
            return;
        }
        send(message);
        _message("");
    }

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight, behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        if (containerRef.current && !isScrolling) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
        socket.on(SocketListeners.USEROFFLINE, (data: { user: number }) => {
            setRecentOffline(prevState => [...prevState, data.user]);
            setOnliners(data.user);
            window.setTimeout(() => {
                setRecentOffline(() => []);
            }, 3000);
        });
        return () => {
            _setScrolling(false);
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
            }, 1000);
        }
        if (containerRef.current) {
            if (containerRef?.current?.scrollHeight - containerRef?.current?.scrollTop === containerRef.current?.clientHeight) {
                _setScrolling(false);
            }
        }
    };
    return (<div className={"convoPanel"}>
        {!options ? (<div className={"wrapperContainer"}>
            <div className={"tagsWrapper"}>
                <div className={"tagsWrapperName"}>{group?.name}</div>

                <div
                    style={{
                        flex: 8, position: "relative", width: "70%", display: !valid ? "" : "none",
                    }}
                >
                    <div className={"infoPanel font-primary"}>
                        {group?.User.map((item: {
                            id: number; name: string; email: string; profileImage: string; ActivityStatus: {
                                id: number;
                                status: | "ONLINE" | "OFFLINE" | "INACTIVE" | "BANNED" | "LEAVE" | "AWAY";
                                date: Date;
                            };
                        }, index: number) => (<Tooltip text={item.name}>
                            <div
                                className={(onliners.filter(_i => _i === item.id).length > 0 || item?.ActivityStatus?.status === "ONLINE") && recentOffline.filter(_k => _k === item.id).length === 0 ? "user-circle usernamewrapper" : "usernamewrapper"}
                                key={index}
                            >
                                <div
                                    className={(onliners.filter(_i => _i === item.id).length > 0 || item?.ActivityStatus?.status === "ONLINE") && recentOffline.filter(_k => _k === item.id).length === 0 ? "usernameImage glow-border" : "usernameImage"}
                                    style={(onliners.filter(_i => _i === item.id).length > 0 || item?.ActivityStatus?.status === "ONLINE") && recentOffline.filter(_k => _k === item.id).length === 0 ? {border: "1px solid green"} : {border: "1px solid white"}}
                                >
                                    <img
                                        src={item?.profileImage.split("").length > 0 ? item.profileImage : groupsImg}
                                        style={{
                                            height: "100%", width: "100%", borderRadius: "50%",
                                        }}
                                        alt={"user-image"}
                                    />
                                </div>
                            </div>
                        </Tooltip>))}
                        {role?.type === "OWNER" && (<div
                            className={"usernamewrapper addMoreBtn"}
                            onClick={() => {
                                handleAddMore();
                            }}
                        >
                            <IoPersonAddSharp size={22}/>
                        </div>)}
                    </div>
                </div>
                <div style={{padding: "4px 8px"}}>
                    <GiHamburgerMenu
                        size={24}
                        color={"white"}
                        onClick={() => {
                            showOptions(true);
                        }}
                        style={{cursor: "pointer"}}
                    />
                </div>
            </div>
            <div
                style={{textAlign: "center", position: "relative"}}
                className={"font-primary"}
            >
                {activity && <div className={"activity-text"}>{activity}</div>}
            </div>
            <div
                className={"convoHistory"}
                ref={containerRef}
                onScroll={handleScroll}
            >
                {loading && (<div style={{position: "relative", marginBottom: "30px"}}>
                    <Spinner/>
                </div>)}
                {state.messages?.map((item: MessageInterface, index: number) => {
                    return (<div>
                        {(formatDateToDDMMYYYY(item.created_at) !== formatDateToDDMMYYYY(state.messages[index ? index - 1 : index].created_at) || !index) && (
                            <motion.div initial={{y: 100}} animate={{y: 0}} className={"w100 message-text-wrapper"}>
                                <div className={"chatDate"}>
                                    {" "}
                                    {formatDateToDDMMYYYY(item.created_at)}
                                </div>
                            </motion.div>)}
                        <motion.div
                            initial={item.senderId === userId ? {x: 100} : {x: -100}}
                            animate={item.senderId === userId ? {x: 0} : {x: -0}}
                            exit={item.senderId === userId ? {x: 100} : {x: -100}}

                            key={index}
                            className={`messageWrapper ${item?.senderId === userId && "selfMessage"}`}
                        >
                            <div className={"font-primary miscContainer"}>
                                {item.senderId !== userId && item.senderId !== state.messages[index ? index - 1 : index].senderId && (
                                    <div
                                        className={`imageWrapper ${item?.senderId === userId && "selfMessageBubble"}`}
                                    >
                                        <img
                                            style={{
                                                height: "100%", width: "100%", borderRadius: "50%",
                                            }}
                                            src={item.User?.profileImage.split("").length > 0 ? item.User.profileImage : groupsImg}
                                        />
                                    </div>)}
                                {item?.senderId !== userId && item.senderId !== state.messages[index ? index - 1 : index].senderId && item?.User.name.toUpperCase()}
                            </div>
                            <div className={"contentWrapper"}>
                                <div
                                    className={`messageBubble ${item?.senderId === userId && "selfMessageBubble"}  `}
                                >
                                    {(item.senderId !== state.messages[index ? index - 1 : index].senderId || !index || formatDateToDDMMYYYY(item.created_at) !== formatDateToDDMMYYYY(state.messages[index ? index - 1 : index].created_at) || !index) && (
                                        <div
                                            className={`arrow ${item.senderId === userId ? "arrow-right" : "arrow-left"}`}
                                        ></div>)}
                                    {item?.MessageContent?.content}
                                    <div
                                        className={"font-primary miscContainer "}
                                        style={{
                                            display: "flex",
                                            justifyContent: item.senderId === userId ? "end" : "start",
                                            color: item.senderId !== userId ? "black" : "whitesmoke",
                                            marginTop: "2px",
                                            alignItems: "center",
                                        }}
                                    >
                                        <RecipientReadStatus item={state.messages[index]}/>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>);
                })}
            </div>
            <div className="textSentInputBtn">
                <form onSubmit={handleSubmit} autoComplete="false">
                    <div className={"optionsPanel"}>
                        <div>
                            <FcAddImage size={"2rem"} color={"#398378"}/>
                        </div>
                        <div className={"inputWrapper"}>
                            <input
                                onChange={handleChange}
                                name={"message"}
                                type={"text"}
                                className={"sendInput"}
                                placeholder={"Type something here..."}
                                value={message}
                            />
                        </div>
                        <div>
                            <IoSend
                                size={"1.5rem"}
                                color={message.split("").length > 0 ? "#398378" : "grey"}
                                onClick={handleSubmit}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>) : (<>
            <GroupOptions
                groupId={group?.id}
                role={role?.type}
                init={init}
                showChat={() => {
                    showOptions(false);
                }}
            />
        </>)}
    </div>);
}