import "./index.css";
import emptyChats from "./../../../assets/svg/empty-chats.svg";
import {getString} from "../../../utils/strings";
import {IoChatbubbleEllipses, IoPersonAddSharp, IoSend} from "react-icons/io5";
import {FcAddImage} from "react-icons/fc";
import {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {_props,} from "../../../services/network/network";
import {ShellContext,} from "../../../services/context/shell.context";
import groupsImg from "./../../../assets/png/defaultuser.png";
import {formatDateToDDMMYYYY, formatTimeToHHMM, useResponsizeClass,} from "../../../utils/functions";
import {Spinner} from "../../Utils/Spinner/spinner";
import {MessageInterface, Role, SocketEmitters, SocketListeners, UserProps,} from "../../../utils/interface";
import {GiHamburgerMenu} from "react-icons/gi";
import {GroupOptions} from "../GroupsPanel/GroupOptions";
import sound from "./../../../assets/sound/notifications-sound.mp3";
import useSound from "use-sound";
import {InviteContainer} from "../GroupsPanel/GroupInvite";
import {IoIosCheckmark} from "react-icons/io";
import Tooltip from "../../Utils/Tooltip";
import {CgProfile} from "react-icons/cg";
import {useWindowSize} from "../../../services/hooks/appHooks";
import {EsidePanel, EwindowSizes, reqType, service, serviceRoute, sidePanelType} from "../../../utils/enum";
import {motion} from "framer-motion";
import {ChatContainer} from "./ChatContainer";

export function Chat() {
    const [messages, _messages] = useState<any[]>([]);
    const [play] = useSound(sound);
    const [group, _group] = useState<{
        tags: string[]; Socket: { id: number; socket_id: string }; User: {
            name: string;
            email: string;
            profileImage: string;
            ActivityStatus: { id: number; status: string; date: Date };
        }[];
    } | null>(null);
    const {groupId, socket, _socketId, socketId, requestId, selectedGroupType} = useContext(ShellContext);
    const [loading, _loading] = useState<boolean>(false);
    const [activity, _activity] = useState<string>("");
    const [params, _params] = useState<{ start: Date; limit: number }>({
        start: new Date(), limit: 20,
    });
    const [rId, _rId] = useState<string | undefined>(undefined);
    const [exceed, _exceed] = useState<boolean>(false);
    const {updateSidePanelState} = useContext(ShellContext);
    const [onliners, setOnliners] = useState<number[]>([]);

    useEffect(() => {
        window.setTimeout(() => {
            _activity("");
        }, 10000);

    }, [activity]);

    useEffect(() => {
        if (groupId) {
            handleCurrentGroup();
        }
        return () => {
            socket?.off(SocketListeners.MESSAGE);
            socket?.off(SocketListeners.TYPING);
            _messages([]);
        };
    }, [groupId]);

    function handleSubmit(text: string) {
        socket?.emit(SocketEmitters._MESSAGE, {text: text});
    }

    function handleCurrentGroup() {
        switch (selectedGroupType) {
            case "CHAT":
                handleChatGroup();
                break;
            case "INVITE":
                handleInviteGroup();
                break;
            case "JOIN":
                handleJoinGroup();
                break;
            default:
                return;
        }
    }

    function handleChatGroup() {
        if (!groupId) return;

        const startDate = new Date();
        const _p = {start: startDate, limit: 20};
        _params({start: startDate, limit: 20});

        if (socketId) {
            socket?.emit(SocketEmitters._DISCONNECT, {socketId});
        }

        _activity("");
        _loading(true);
        _messages([]);
        _group(null);

        _props._db(service.group)
            .query(serviceRoute.groupById, {}, reqType.get, groupId)
            .then(result => {
                if (result.data) {
                    document.title = result.data.name;
                    _loading(false);
                    _group(result.data);
                    const socketId = result.data.Socket.socket_id;
                    _socketId(socketId);
                    socket?.connect();
                    socket?.emit(SocketEmitters._JOIN, {socketId});
                }
            });

        _props._db(service.group)
            .query(serviceRoute._groupMessages, _p, reqType.post, groupId)
            .then(result => {
                _loading(false);
                _messages(result.data.reverse());
                if (result.data.length === 0) {
                    _exceed(true);
                } else {
                    _params({...params, start: result.data[0].created_at});
                }
            });

        socket.on(SocketListeners.USERONLINE, (data: { user: number; }) => {
            const users = onliners.filter(item => item !== data.user);
            setOnliners([...users, data.user]);
        });

        socket?.on(SocketListeners.MESSAGE, async (data: { senderId: any; id: any; }) => {
            _activity("");
            const user: UserProps = await _props._user().get();

            if (user && user.id !== data.senderId) {
                play({forceSoundEnabled: true});
            }
            _messages(prevMessage => prevMessage === null ? [data] : [...prevMessage, data]);
            setTimeout(() => {
                socket.emit(SocketEmitters._READMESSAGE, {messageId: data.id, userId: user.id});
            }, 2000);
        });

        socket?.on(SocketListeners.TYPING, async ({name}: { name: string }) => {
            debugger
            const user: UserProps = await _props._user().get();
            if (user && group) {
                const username = group.User
                    .filter(item => item.email === name)
                    .map(item => item.name)
                    .filter(item => item !== user.name);

                if (username.length > 0) {
                    _activity(`${username[0]} is writing`);
                }
            }
        });
    }

    function handleInviteGroup() {
        _rId(requestId);
    }

    function handleJoinGroup() {
        // No action needed for joining a group
    }


    function refetch() {
        if (!exceed) {
            let limit = params.limit;
            let data = {start: params.start, limit};
            _props
                ._db(service.group)
                .query(serviceRoute._groupMessages, data, reqType.post, groupId)
                .then(result => {
                    _loading(false);
                    _messages([...result.data.reverse(), ...messages]);
                    if (result.data.length === 0) {
                        _exceed(true);
                    } else {
                        _params({start: result.data[0].created_at, limit: limit});
                    }
                });
        }
    }

    function handleSidePanels(panel: sidePanelType) {
        updateSidePanelState(function (previous: { [x: string]: any }) {
            return {
                ...previous, [panel]: !previous[panel],
            };
        });
    }

    return (<div className="midPanelWrapper">
        <div
            className={"sidePanelBtnContainer" + useResponsizeClass(EwindowSizes.S, ["dflex"])}
        >
            <IoChatbubbleEllipses
                className="btn-wrapper-options"
                color="white"
                size="30px"
                onClick={() => handleSidePanels(EsidePanel.group)}
            />
            <CgProfile
                className="btn-wrapper-options"
                color="white"
                size="30px"
                onClick={() => handleSidePanels(EsidePanel.utit)}
            />
        </div>

        <div
            className={"shadow-box" + useResponsizeClass(EwindowSizes.S, ["height95"])}
            style={{height: "100%"}}
        >
            <div className={"wrapper"}>
                {loading && <Spinner/>}
                {selectedGroupType === "CHAT" && (<ChatContainer
                    setOnliners={(id: number) => {
                        let old = onliners.filter(item => item !== id);
                        setOnliners(() => [...old]);
                    }}
                    fetch={() => {
                        refetch();
                    }}
                    exceed={exceed}
                    messages={messages}
                    group={group}
                    activity={activity}
                    send={(s: string) => {
                        handleSubmit(s);
                    }}
                    onliners={onliners}
                />)}
                {selectedGroupType === "INVITE" && (<InviteContainer type={selectedGroupType} requestId={rId}/>)}
                {!selectedGroupType && (<div className={"noChatContainer"}>
                    <div className={"emptyImage"}>
                        <img src={emptyChats} alt={"No Chats"}/>
                    </div>
                    <div className={"font-primary"}>{getString(2)}</div>
                </div>)}
                {selectedGroupType === "JOIN" && (<InviteContainer type={selectedGroupType} groupId={groupId}/>)}
            </div>
        </div>
    </div>);
}


