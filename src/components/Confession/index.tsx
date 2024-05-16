import React, {useEffect, useRef, useState} from "react";
import {Input} from "../Utils/CustomInput";
import './index.css';
import {PiPaperPlaneTiltFill} from "react-icons/pi";
import {io, Socket} from "socket.io-client";
import {service} from "../../utils/enum";
import {getDeviceID, validateAskText} from "../../utils/functions";
import Snackbar from "../Utils/Snackbar";
import {motion} from "framer-motion";
import {startLogger} from "hawkeye";
import moksha from './../../assets/png/moksha.png'
import {getString} from "../../utils/strings";

interface Props {
    click: () => void;
}

interface Message {
    sender: 'User' | 'Model';
    message: string;
}

export const Confession = (props: Props) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState("Hi Moksha!");
    const [conversation, setConversation] = useState<Message[]>([]);
    const scrollableDivRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const newSocket = io(service.bot, {
            autoConnect: true,
            reconnectionAttempts: 1,
        });
        setSocket(newSocket);
        scrollToBottom(scrollableDivRef);
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('listen', handleSocketListener);
        }
    }, [socket]);

    function handleSocketMessageUpdate(m: string) {
        setMessage(m);
    }

    function addConversationMessages(payload: Message) {
        setConversation(prevConversation => [...prevConversation, payload]);
    }

    async function handleSocketMessageSend() {
        if (validateAskText(message).isValid) {
            let device = await getDeviceID();
            let payload = {
                deviceId: device.identifier,
                message: message,
            };
            socket?.emit('ask', payload);
            addConversationMessages({sender: 'User', message: message});
            setMessage('');
            scrollToBottom(scrollableDivRef);
        } else {
            setError(validateAskText(message).message);
        }
    }

    function handleSocketListener(e: any) {
        addConversationMessages({sender: 'Model', message: e.message})
    }

    useEffect(() => {
        scrollToBottom(scrollableDivRef);
    }, [conversation]);

    function scrollToBottom(ref: React.RefObject<HTMLDivElement>): void {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }

    return (
        <>
            <Snackbar message={error} onClose={() => setError('')}/>
            <div className="confession">
                <div className={'chat-history-container'} ref={scrollableDivRef}>
                    {!conversation.length ? renderEmptyMessageConversation() :
                        conversation.map((text, index) => (
                            <motion.div initial={{y: 10}}
                                        animate={{y: 0}}
                                        transition={{speed: 2}}
                                        key={index} className={'font-primary m4 chat-wrapper'}>
                              <span style={{color: 'lightyellow'}}>  {text.sender === 'User' && ' Jamie Jackson : '}
                              </span>
                                <span
                                    className={'font-secondary font-thick'}> {text.sender === 'Model' && 'Moksha.ai : '}</span>
                                {text.message}
                            </motion.div>
                        ))}
                </div>
                <div className={'confession_container'}>
                    <Input
                        height={"4em"}
                        borderRadius={'50px'}
                        textColor={'#706c6c'}
                        placeholder={"Describe what you are feeling, no one knows you here."}
                        allowToggle={false}
                        disabled={false}
                        icon={<PiPaperPlaneTiltFill size={28} color={'#398378'}/>}
                        type={'text'}
                        onChange={(e) => handleSocketMessageUpdate(e.target.value)}
                        inputName={"confession"}
                        send={handleSocketMessageSend}
                        listenSubmit={true}
                        value={message}
                    />
                    <div className={'btncontainer pointer'}>
                        <div className={'font-primary'}>
                            Or
                        </div>
                        <div className={'loginbtn font-primary font-thick'} onClick={props.click}>
                            Login
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

function renderEmptyMessageConversation() {
    return <div className={'emptycontainer font-primary'}>
        <div className={' container-ele-wrapper'}>
            <div className={'moksha-container'}>
                <img src={moksha} alt={'mokasha-image'} height={'100%'} width={'100%'}
                     style={{objectFit: 'contain'}}/>
            </div>
            <div className={'text-container'}>
                <p>Hey,</p>
                <h4>I am <span className={'font-secondary'}>
                {getString(24)}
                </span></h4>
            </div>
        </div>
    </div>
}
