import "./index.css";
import emptyChats from "./../../../assets/svg/empty-chats.svg";
import {getString} from "../../../utils/strings";
import {IoPersonAddSharp, IoSend} from "react-icons/io5";
import {FcAddImage} from "react-icons/fc";
import {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {
  _props,
  reqType,
  service,
  serviceRoute,
} from "../../../services/network/network";
import {
  EsidePanel,
  ShellContext,
  sidePanelType,
} from "../../../services/context/shell.context";
import groupsImg from "./../../../assets/png/defaultuser.png";
import {formatDateToDDMMYYYY, formatTimeToHHMM} from "../../../utils/functions";
import {Spinner} from "../../utility/Spinner/spinner";
import {Role, SocketEmitters, SocketListeners} from "../../../utils/interface";
import {GiHamburgerMenu} from "react-icons/gi";
import {GroupOptions} from "../GroupsPanel/GroupOptions";
import sound from "./../../../assets/sound/notifications-sound.mp3";
import useSound from "use-sound";
import {InviteContainer} from "../GroupsPanel/GroupInvite";
import {IoIosCheckmark} from "react-icons/io";
import {FaAnglesDown} from "react-icons/fa6";
import Tooltip from "../../utility/Tooltip";
import {IoChatbubbleEllipses} from "react-icons/io5";
import {CgProfile} from "react-icons/cg";
import {EwindowSizes, useWindowSize} from "../../../services/hooks/appHooks";

export function Chat() {
  const [messages, _messages] = useState<any[]>([]);
  const [play] = useSound(sound);
  const [group, _group] = useState<{
    tags: string[];
    Socket: {id: number; socket_id: string};
    User: {
      name: string;
      email: string;
      profileImage: string;
      ActivityStatus: {id: number; status: string; date: Date};
    }[];
  } | null>(null);
  const {groupId, socket, _socketId, socketId, requestId, selectedGroupType} =
    useContext(ShellContext);
  const [loading, _loading] = useState<boolean>(false);
  const [activity, _activity] = useState<string>("");
  const [params, _params] = useState<{start: Date; limit: number}>({
    start: new Date(),
    limit: 20,
  });
  const [rId, _rId] = useState<string | undefined>(undefined);
  const [exceed, _exceed] = useState<boolean>(false);

  function handleSubmit(s: string) {
    socket?.emit(SocketEmitters._MESSAGE, {text: s});
  }

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
    };
  }, [groupId, socketId]);
  const [onliners, setOnliners] = useState<number[]>([]);

  function handleCurrentGroup() {
    let gid = groupId;
    switch (selectedGroupType) {
      case "CHAT":
        let startDate = new Date();
        const _p = {start: startDate, limit: 20};
        _params({start: new Date(), limit: 20});
        if (gid && socketId) {
          socket?.emit(SocketEmitters._DISCONNECT, {socketId: socketId});
        }
        if (gid) {
          _activity("");
          _loading(true);
          _messages([]);
          _group(null);
          _props
            ._db(service.group)
            .query(serviceRoute.groupById, {}, reqType.get, gid)
            .then(result => {
              if (result.data) {
                document.title = result.data.name;
                _loading(false);
                _group(result.data);
                _socketId(result.data.Socket.socket_id);
                socket?.connect();
                socket?.emit(SocketEmitters._JOIN, {
                  socketId: result.data.Socket.socket_id,
                });
              }
            });
          _props
            ._db(service.group)
            .query(serviceRoute._groupMessages, _p, reqType.post, gid)
            .then(result => {
              _loading(false);
              _messages(result.data.reverse());
              if (result.data.length === 0) {
                _exceed(true);
              } else {
                _params({...params, start: result.data[0].created_at});
              }
            });

          socket.on(SocketListeners.USERONLINE, (data: any) => {
            let users = onliners.filter(item => item !== data.user);
            setOnliners(() => [...users, data.user]);
          });

          socket?.on(SocketListeners.MESSAGE, (data: any) => {
            _activity("");
            let user: any = window.localStorage.getItem("_user");
            if (user) {
              user = JSON.parse(user);
              if (user.id !== data.senderId) {
                play({forceSoundEnabled: true});
              }
            }
            _messages(prevMessage => {
              if (prevMessage === null) {
                return [data];
              } else {
                return [...prevMessage, data];
              }
            });
            window.setTimeout(() => {
              // check if message is ready by all after receiving
              socket.emit(SocketEmitters._READMESSAGE, {
                messageId: data.id,
                userId: user.id,
              });
            }, 2000);
          });
          socket?.on(SocketListeners.TYPING, ({name}: {name: string}) => {
            let user = window.localStorage.getItem("_user");
            if (user) {
              let u = JSON.parse(user);
              if (group) {
                const username = group.User.filter(
                  (item: {email: string; name: string}) => item.email === name
                )
                  .map((item: {name: any}) => item.name)
                  .filter(item => item !== u.name);
                if (username.length > 0) {
                  _activity(username[0].toString() + " is writing");
                }
              }
            }
          });
        }
        return;
      case "INVITE":
        _rId(requestId);
        return;

      case "JOIN":
        return;

      default:
        return;
    }
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
  const {size: valid} = useWindowSize(EwindowSizes.S);
  const {updateSidePanelState, sidePanel} = useContext(ShellContext);

  function handleSidePanels(panel: sidePanelType) {
    updateSidePanelState(function (previous: {[x: string]: any}) {
      return {
        ...previous,
        [panel]: !previous[panel],
      };
    });
  }
  return (
    <div className="midPanelWrapper">
      {valid && (
        <div className="sidePanelBtnContainer">
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
      )}
      <div className={"shadow-box"}>
        <div className={"wrapper"}>
          {loading && <Spinner />}
          {selectedGroupType === "CHAT" && (
            <ConversationWrapper
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
            />
          )}
          {selectedGroupType === "INVITE" && (
            <InviteContainer type={selectedGroupType} requestId={rId} />
          )}
          {!selectedGroupType && (
            <div className={"noChatContainer"}>
              <div className={"emptyImage"}>
                <img src={emptyChats} alt={"No Chats"} />
              </div>
              <div className={"font-primary"}>{getString(2)}</div>
            </div>
          )}
          {selectedGroupType === "JOIN" && (
            <InviteContainer type={selectedGroupType} groupId={groupId} />
          )}
        </div>
      </div>
    </div>
  );
}

interface MessageInterface {
  MessageContent: MessageContent;
  created_at: string;
  groupId: number;
  id: number;
  messageContentId: number;
  senderId: number;
  status: string;
  User: {
    name: string;
    email: string;
    profileImage: string;
    id: number;
  };
  ReadByAll?: boolean;
  ReadReceipt: {
    id: number;
    userId: number;
    status: "Read" | "Sent";
  }[];
}

interface MessageContent {
  id: number;
  caption: null | string;
  content: string;
}

export function ConversationWrapper({
  messages,
  group,
  activity,
  send,
  fetch,
  exceed,
  onliners,
  setOnliners,
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
    tags?: string[];
    messages: MessageInterface[];
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

  useEffect(() => {
    _loading(false);
  }, [exceed]);

  useEffect(() => {
    if (group?.id) {
      _props
        ._db(service.group)
        .query(serviceRoute.groupRole, {}, reqType.get, group.id)
        .then((result: {data: Role}) => {
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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = (force?: boolean) => {
    if (!isScrolling || force) {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  const [recentOffline, setRecentOffline] = useState<number[]>([]);
  useEffect(() => {
    if (containerRef.current && !isScrolling) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    socket.on(SocketListeners.USEROFFLINE, (data: {user: number}) => {
      let d = recentOffline.filter(item => item !== data.user);
      setRecentOffline(prevState => [...prevState, data.user]);
      setOnliners(data.user);
      window.setTimeout(() => {
        setRecentOffline(() => []);
      }, 3000);
    });
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
      if (
        containerRef?.current?.scrollHeight -
          containerRef?.current?.scrollTop ===
        containerRef.current?.clientHeight
      ) {
        _setScrolling(false);
      }
    }
  };
  const {size: valid} = useWindowSize(EwindowSizes.S);
  return (
    <div className={"convoPanel"}>
      {/* {isScrolling && !options && (
        <div className={"scrollToBottom"}>
          <FaAnglesDown
            color={"#044a40"}
            size={20}
            onClick={() => {
              _setScrolling(false);
              scrollToBottom(true);
            }}
          />
        </div>
      )} */}
      {!options ? (
        <div className={"wrapperContainer"}>
          <div className={"tagsWrapper"}>
            <div className={"tagsWrapperName"}>{group?.name}</div>
            <div style={{flex: 8, position: "relative", width: "70%"}}>
              <div className={"infoPanel font-primary"}>
                {group?.User.map(
                  (
                    item: {
                      id: number;
                      name: string;
                      email: string;
                      profileImage: string;
                      ActivityStatus: {
                        id: number;
                        status:
                          | "ONLINE"
                          | "OFFLINE"
                          | "INACTIVE"
                          | "BANNED"
                          | "LEAVE"
                          | "AWAY";
                        date: Date;
                      };
                    },
                    index: number
                  ) => (
                    <Tooltip text={item.name}>
                      <div
                        className={
                          (onliners.filter(_i => _i === item.id).length > 0 ||
                            item?.ActivityStatus?.status === "ONLINE") &&
                          recentOffline.filter(_k => _k === item.id).length ===
                            0
                            ? "user-circle usernamewrapper"
                            : "usernamewrapper"
                        }
                        key={index}
                      >
                        <div
                          className={
                            (onliners.filter(_i => _i === item.id).length > 0 ||
                              item?.ActivityStatus?.status === "ONLINE") &&
                            recentOffline.filter(_k => _k === item.id)
                              .length === 0
                              ? "usernameImage glow-border"
                              : "usernameImage"
                          }
                          style={
                            (onliners.filter(_i => _i === item.id).length > 0 ||
                              item?.ActivityStatus?.status === "ONLINE") &&
                            recentOffline.filter(_k => _k === item.id)
                              .length === 0
                              ? {border: "1px solid green"}
                              : {border: "1px solid white"}
                          }
                        >
                          <img
                            src={
                              item?.profileImage.split("").length > 0
                                ? item.profileImage
                                : groupsImg
                            }
                            style={{
                              height: "100%",
                              width: "100%",
                              borderRadius: "50%",
                            }}
                            alt={"user-image"}
                          />
                        </div>
                      </div>
                    </Tooltip>
                  )
                )}
                {role?.type === "OWNER" && (
                  <div
                    className={"usernamewrapper addMoreBtn"}
                    onClick={() => {
                      handleAddMore();
                    }}
                  >
                    <IoPersonAddSharp size={22} />
                  </div>
                )}
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
            {loading && (
              <div style={{position: "relative", marginBottom: "30px"}}>
                <Spinner />
              </div>
            )}
            {state.messages?.map((item: MessageInterface, index: number) => {
              return (
                <>
                  {(formatDateToDDMMYYYY(item.created_at) !==
                    formatDateToDDMMYYYY(
                      state.messages[index ? index - 1 : index].created_at
                    ) ||
                    !index) && (
                    <div className={"w100 message-text-wrapper"}>
                      <div className={"chatDate"}>
                        {" "}
                        {formatDateToDDMMYYYY(item.created_at)}
                      </div>
                    </div>
                  )}
                  <div
                    key={index}
                    className={`messageWrapper ${
                      item?.senderId === userId && "selfMessage"
                    }`}
                  >
                    <div className={"font-primary miscContainer"}>
                      {item.senderId !== userId &&
                        item.senderId !==
                          state.messages[index ? index - 1 : index]
                            .senderId && (
                          <div
                            className={`imageWrapper ${
                              item?.senderId === userId && "selfMessageBubble"
                            }`}
                          >
                            <img
                              style={{
                                height: "100%",
                                width: "100%",
                                borderRadius: "50%",
                              }}
                              src={
                                item.User?.profileImage.split("").length > 0
                                  ? item.User.profileImage
                                  : groupsImg
                              }
                            />
                          </div>
                        )}
                      {item?.senderId !== userId &&
                        item.senderId !==
                          state.messages[index ? index - 1 : index].senderId &&
                        item?.User.name.toUpperCase()}
                    </div>
                    <div className={"contentWrapper"}>
                      <div
                        className={`messageBubble ${
                          item?.senderId === userId && "selfMessageBubble"
                        }  `}
                      >
                        {(item.senderId !==
                          state.messages[index ? index - 1 : index].senderId ||
                          !index ||
                          formatDateToDDMMYYYY(item.created_at) !==
                            formatDateToDDMMYYYY(
                              state.messages[index ? index - 1 : index]
                                .created_at
                            ) ||
                          !index) && (
                          <div
                            className={`arrow ${
                              item.senderId === userId
                                ? "arrow-right"
                                : "arrow-left"
                            }`}
                          ></div>
                        )}
                        {item?.MessageContent?.content}
                        <div
                          className={"font-primary miscContainer "}
                          style={{
                            display: "flex",
                            justifyContent:
                              item.senderId === userId ? "end" : "start",
                            color:
                              item.senderId !== userId ? "black" : "whitesmoke",
                            marginTop: "2px",
                            alignItems: "center",
                          }}
                        >
                          <MessageReadIcon item={state.messages[index]} />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          <div style={{flex: valid ? "2" : "2"}}>
            <form onSubmit={handleSubmit} autoComplete="false">
              <div className={"optionsPanel"}>
                <div>
                  <FcAddImage size={"2rem"} color={"#398378"} />
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
        </div>
      ) : (
        <>
          <GroupOptions
            groupId={group?.id}
            role={role?.type}
            init={init}
            showChat={() => {
              showOptions(false);
            }}
          />
        </>
      )}
    </div>
  );
}

function MessageReadIcon({item}: {item: any}) {
  const {userId, socket} = useContext(ShellContext);
  const [isRead, setRead] = useState<boolean>(
    item?.ReadReceipt?.filter((_i: {status: string}) => _i.status !== "Read")
      .length > 0
  );

  useEffect(() => {
    const handleReadByAll = (data: any) => {
      if (data.id === item.id) {
        setRead(true);
      }
    };

    if (socket) {
      socket.on(SocketListeners.READBYALL, handleReadByAll);

      return () => {
        socket.off(SocketListeners.READBYALL, handleReadByAll);
      };
    }
  }, [socket, item.id]);

  return (
    <>
      {formatTimeToHHMM(item.created_at)}{" "}
      {item.senderId === userId && (
        <div style={{margin: "0 0px 0 10px"}}>
          <IoIosCheckmark
            size={18}
            color={isRead ? "whitesmoke" : "rgb(0, 183, 255)"}
          />
        </div>
      )}
    </>
  );
}
