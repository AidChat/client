import {useContext, useEffect, useState} from "react";
import {ShellContext} from "../../../services/context/shell.context";
import {SocketListeners} from "../../../utils/interface";
import {formatTimeToHHMM} from "../../../utils/functions";
import {IoIosCheckmark} from "react-icons/io";
import {RiCheckDoubleLine} from "react-icons/ri";

export function RecipientReadStatus({item}: { item: any }) {
    const {userId, socket} = useContext(ShellContext);
    const [isRead, setRead] = useState<boolean>(item?.ReadReceipt?.filter((_i: {
        status: string
    }) => _i.status !== "Read").length > 0);

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

    return (<>
        {formatTimeToHHMM(item.created_at)}{" "}
        {item.senderId === userId && (<div style={{margin: "0 0px 0 10px"}}>
            {true ? <IoIosCheckmark
                size={18}
                color={"whitesmoke"}
            /> : <RiCheckDoubleLine size={14}
                                    color={"rgb(0, 183, 255)"}/>}
        </div>)}
    </>);
}
