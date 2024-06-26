import React, {useContext, useEffect, useRef, useState} from "react";
import {Input} from "../Utils/CustomInput";
import "./index.css";
import {PiPaperPlaneTiltFill} from "react-icons/pi";
import {IDBStore} from "../../utils/enum";
import {
  clearDatabaseByName,
  confirm,
  getDeviceID,
  queryStoreObjects,
  storeChatsByDeviceID,
  validateAskText,
} from "../../utils/functions";
import Snackbar from "../Utils/Snackbar";
import {motion} from "framer-motion";
import {startLogger} from "aidchat-hawkeye";
import moksha from "./../../assets/png/moksha.png";
import {getString} from "../../utils/strings";
import {Message, SocketEmitters, SocketListeners} from "../../utils/interface";
import {MdDeleteOutline} from "react-icons/md";
import Tooltip from "../Utils/Tooltip";
import {MokshaIcon} from "./Icon";
import {AuthContext} from "../../services/context/auth.context";
import {ConfirmDialog} from "primereact/confirmdialog";
import Markdown from "react-markdown";

interface Props {
  click: () => void;
}

export const ClientChatWindow = (props: Props) => {
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState("Hi Moksha!");
  const [conversation, setConversation] = useState<Message[]>([]);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  let ac = useContext(AuthContext);
  useEffect(() => {
    scrollToBottom(scrollableDivRef);
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
      let device = await getDeviceID();
      let payload = {
        deviceId: device.identifier,
        message: message,
      };
      ac?.mokshaSocket?.emit(SocketEmitters._ASK, payload);
      addConversationMessages({sender: "User", message: message});
      setMessage("");
      scrollToBottom(scrollableDivRef);
    } else {
      setError(validateAskText(message).message);
    }
  }

  function handleSocketListener(e: any) {
    addConversationMessages({sender: "Model", message: e.message});
  }

  useEffect(() => {
    scrollToBottom(scrollableDivRef);
  }, [conversation]);
  useEffect(() => {
    startLogger({interval: 30000});
    queryStoreObjects(IDBStore.chat).then(function (data: any) {
      if (data && data[0]?.chats) {
        setConversation(data[0]?.chats);
        setMessage("");
      }
    });
  }, []);

  function scrollToBottom(ref: React.RefObject<HTMLDivElement>): void {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }


  return (
    <>
      <ConfirmDialog />
      <Snackbar message={error} onClose={() => setError("")} />
      <div className="confession">
        <MokshaIcon
          online={!!ac?.isMokshaAvailable}
          size={"small"}
          top={true}
          right={true}
        />
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
                    className={"font-primary m4 chat-wrapper"}
                  >
                    <>
                      <span style={{color: "lightyellow"}}>
                        {" "}
                        {text.sender === "User" && " Timon  : "}
                      </span>
                      <span className={"font-secondary font-thick"}>
                        {" "}
                        {text.sender === "Model" && `${getString(24)} : `}
                      </span>
                      <Markdown>{text.message}</Markdown>
                      {text.sender === "Model" && (
                        <div
                          onClick={async () => {
                            let accepted = await confirm({
                              message:
                                "Do you wanna report this reply from Moksha?",
                              header: "Confirmation",
                            });
                          }}
                          className={"font-primary font-thick reportBtn"}
                        >
                          Report
                        </div>
                      )}
                    </>
                  </motion.div>
                  <div className={"dotted-border"}></div>
                </>
              ))}
        </div>
        <div className={"confession_container"}>
          <div className={"h100 flex center  justify-center clear"}>
            <Tooltip text={"Clear chat"}>
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
            </Tooltip>
          </div>

          <Input
            height={"4em"}
            borderRadius={"50px"}
            textColor={"whitesmoke"}
            placeholder={
              "Describe what you are feeling, no one knows you here."
            }
            allowToggle={false}
            disabled={false}
            icon={<PiPaperPlaneTiltFill size={22} color={"#398378"} />}
            type={"text"}
            onChange={e => handleSocketMessageUpdate(e.target.value)}
            inputName={"confession"}
            send={handleSocketMessageSend}
            listenSubmit={true}
            value={message}
          />
          <div className={"btncontainer pointer"}>
            <div className={"font-primary"}>Or</div>
            <div
              className={"loginbtn font-primary font-thick"}
              onClick={props.click}
            >
              Login
            </div>
          </div>
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
