import {motion} from 'framer-motion'
import './index.css'
import {useState} from "react";
import {confirm, useResponsizeClass} from "../../../utils/functions";
import {EwindowSizes, reqType, service, serviceRoute} from "../../../utils/enum";
import {_props} from "../../../services/network/network";
import Snackbar from "../../Utils/Snackbar";

export function Seeker(props: { group: any,refetch:()=>void }) {
    const [groupInfo, setGroupInfo] = useState(props.group[0])
    const [message,setMessage] = useState("");
    function handleGroupUpdate(type: "ACCEPT" | "REJECT") {
        if (type === "REJECT") {
            confirm({
                header: "Looking for someone else?",
                message: "Didn't like the person. That's absolutely fine ,we are looking for someone to help you asap. Meanwhile Moksha is always there to help you."
            })
                .then(function (result) {
                    if (result) {
                        handleRequestReject()
                    }
                })
        }
        if (type === "ACCEPT") {
            confirm({
                header:"Confirmation",
                message:"We will connect you with" + groupInfo.Request[0].user.Username + ". Once that is done you can continue your chat with them.",
            })
                .then(function (result){
                    if (result) {
                        handleRequestAccept();
                    }
                })
        }
    }

    console.log(groupInfo)
    function handleRequestReject() {
        _props._db(service.group).query(serviceRoute.updateInvite, {status: "REJECTED"}, reqType.put, groupInfo.Request[0].id).then(response=>{
            setMessage(response.message)
            props.refetch();
        })
    }
    function handleRequestAccept(){
       _props._db(service.group).query(serviceRoute.request, undefined, reqType.put, groupInfo.Request[0].id).then(response=>{
           setMessage(response.message);
           props.refetch();
       })
    }


    return (
        <motion.div initial={{y: 50, display: "none", opacity: 0}} exit={{y: -500}}
                    animate={{y: 0, display: 'block', opacity: 1}} transition={{delay: 0.5, duration: 1}}
                    className={'seeker-container w80 flex flex-center'}>
            <Snackbar message={message} onClose={()=>setMessage('')} />
            <div className={"h100 w100 flex " + useResponsizeClass(EwindowSizes.S, [ ' flex-column'])}>
                <div className={'w80 h100'}>
                    <div className={'dflex flex-row'}>
                        <div className={'simage h100'}>
                            <img className={'h100 w100'} src={groupInfo.Request[0].user.profileImage}/>
                        </div>
                        <div className={'p8'}>Hey, I am <span
                            className={'font-secondary font-large'}>{groupInfo.Request[0].user.Username}</span>
                            <div>I saw you are looking for some help, I can surely make you feel better at the moment.
                            </div>
                            <div>{groupInfo.Request[0].user.about}</div>
                        </div>
                    </div>
                </div>
                <div className={'w10 s-btn-container ' + useResponsizeClass(EwindowSizes.S, [ ' flex-column flex-right'])}>
                    <div className={'btn  btn-round-secondary'} onClick={() => {
                        handleGroupUpdate("ACCEPT")
                    }}>Accept
                    </div>
                    <div className={'btn  btn-round-secondary btn-custom'} onClick={() => {
                        handleGroupUpdate("REJECT")
                    }}>Reject
                    </div>
                </div>
            </div>
        </motion.div>
    )
}