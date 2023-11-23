import React, {useEffect, useState} from "react";
import {Spinner} from "../../../utility/spinner/spinner";
import './index.css'
import {_props, reqType, service, serviceRoute} from "../../../../services/network/network";
import {MdDelete} from "react-icons/md";
import Snackbar from "../../../utility/Snackbar";
import {Role} from "../../../../utils/interface";
import {SiMinutemailer} from "react-icons/si";
import {RiCloseCircleLine} from "react-icons/ri";
import {GoBlocked} from "react-icons/go";
import {FaUserPlus} from "react-icons/fa";

export function Requests(props: { groupId: string }) {
    const [data, setData] = useState(true);
    const [requests, _requests] = useState<Request[] | null>(null);

    function fetchData() {
        _props._db(service.group).query(serviceRoute.groupInvite, {}, reqType.get, props.groupId)
            .then((result) => {
                if (result.data.length) {
                    _requests(result.data);
                }
            })
    }

    useEffect(() => {
        fetchData()
    }, []);
    return (
        <div className={'members-container'}>
            {
                data ?
                    <div className={'font-primary'}>
                        <SendRequestPanelContainer fetch={() => {
                            fetchData()
                        }} groupId={props.groupId}/>
                        <AllRequestsPanelContainer fetch={() => {
                            fetchData()
                        }} requests={requests}/>
                    </div>
                    : <Spinner/>
            }
        </div>
    )
}


function SendRequestPanelContainer({groupId, fetch}: { groupId: string, fetch: () => void }) {
    const [email, _email] = useState<string>('');
    const [loading, _loading] = useState<boolean>(false);
    const [message, _message] = useState<string | null>(null);
    const [isAdmin, _setAdmin] = useState<boolean>(false)
    const [role, setRole] = useState<Role | null>(null);

    function handleSendInvite() {
        if (!loading) {
            console.log(email)
            if (true) {
                _loading(true);
                _props._db(service.group).query(serviceRoute.groupInvite, {
                    'requestee': email,
                    'role': isAdmin ? 'ADMIN' : 'MEMBER'
                }, reqType.post, groupId)
                    .then((result) => {
                        _message(result.message);
                        fetch();
                        _email('');
                        _loading(false);
                    })
                    .catch(error => {
                        _loading(false);
                        console.log(error)
                    })
            } else {
                _message("Please enter a valid email");
            }
        }
    }

    useEffect(() => {
        _props._db(service.group).query(serviceRoute.groupRole, {}, reqType.get, groupId)
            .then((result: { data: Role }) => {
                setRole(result.data);
            })
    }, []);

    return (

        <>
            {message && <Snackbar message={message} onClose={() => {
                _message(null)
            }}/>}
            <form onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                handleSendInvite()
            }}>
                <div className={'requestWrapper'}>

                    <div className={'inputWrapper'}>
                        <input required={true} type={'email'} value={email} onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                handleSendInvite()
                            }
                        }} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            _email(e.target.value)
                        }} placeholder={'Please enter the email to send an invite'}
                               className={'sendInviteInput'}/>
                    </div>
                    {role?.type === 'OWNER' && <div className={'admin-panel'}>
                        <label className="switch">
                            <input type="checkbox" checked={isAdmin} onClick={() => {
                                _setAdmin(!isAdmin)
                            }}/>
                            <span className="slider round"></span>
                        </label>
                        <div>Invite as admin</div>
                    </div>}

                    <div className={'sendInviteBtn'}>
                        <div className={'btn btn-primary btn-custom'} onClick={() => {
                            handleSendInvite()
                        }}> {'Send Invite'}
                        </div>
                    </div>
                    {loading && <Spinner/>}
                </div>
            </form>
        </>
    )
}

function AllRequestsPanelContainer({requests, fetch}: { fetch: () => void, requests: Request[] | null }) {
    const [allRequests, _requests] = useState<Request[] | null>(requests)
    const [message, _message] = useState<string | null>(null);
    useEffect(() => {
        _requests(requests);
    }, [requests]);

    function handleDelete(requestId: string) {
        _props._db(service.group).query(serviceRoute.groupInvite, {}, reqType.delete, requestId)
            .then((response) => {
                fetch();
                _message(response.message);

            })
    }
    function handleGroupJoin(requestId:string){
        _props._db(service.group).query(serviceRoute.request, {},reqType.put,requestId)
            .then((response:any)=>{
                fetch();
                _message(response.message);
            })
    }


    return (
        <>
            {allRequests ? <>
                    {message && <Snackbar message={message} onClose={() => {
                        _message(null)
                    }}/>}
                    {allRequests.map((item: Request, index: number) =>
                        <div className={'shadow userlistWrapper'} key={index}>
                            <div> {item.invitee}</div>

                            <div className={'flex'}>
                                {item.type === 'INVITE' ?
                                    <>
                                {item.status === 'PENDING' && <SiMinutemailer size={26} color={'white'}/>}
                                {item.status === 'REJECTED' && <RiCloseCircleLine  size={26} color={'yellow'}/>}
                                {item.status === 'BLOCKED' && <GoBlocked   size={26} color={'red'}/>}</>
                                :<>
                                        <div className={''} onClick={()=>{handleGroupJoin(item.id)}} >Accept</div>
                                        <FaUserPlus  size={26} color={'#183b35'} />
                                    </>
                                }

                                <div style={{margin: '0 10px'}}><MdDelete onClick={() => {
                                    handleDelete(item.id)
                                }} size={26}/></div>
                            </div>
                        </div>
                    )
                    }
                </>
                :
                <div className={'noRequestWrapper'}>
                    No active requests yet!
                </div>}
        </>
    )
}

interface Request {
    groupId: number,
    id: string,
    invitee: string,
    userId: number,
    status: "ACCEPTED" | "PENDING" | "REJECTED" | "BLOCKED"
    type :"INVITE" | "MANUAL"   | "DELETE"
}