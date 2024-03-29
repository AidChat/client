import React, {useEffect, useState} from "react";
import {Spinner} from "../../../Utils/Spinner/spinner";
import "./index.css";
import {_props,} from "../../../../services/network/network";
import {MdDelete} from "react-icons/md";
import Snackbar from "../../../Utils/Snackbar";
import {Role} from "../../../../utils/interface";
import {SiMinutemailer} from "react-icons/si";
import {RiCloseCircleLine} from "react-icons/ri";
import {GoBlocked} from "react-icons/go";
import {FaUserPlus} from "react-icons/fa";
import Tooltip from "../../../Utils/Tooltip";
import {validateEmail} from "../../../../utils/functions";
import {useWindowSize} from "../../../../services/hooks/appHooks";
import {EwindowSizes, reqType, service, serviceRoute} from "../../../../utils/enum";
import {motion} from "framer-motion";

export function Requests(props: { groupId: number }) {
    const [data, setData] = useState(true);
    const [requests, _requests] = useState<Request[] | null>(null);

    function fetchData() {
        _props
            ._db(service.group)
            .query(serviceRoute.groupInvite, {}, reqType.get, props.groupId)
            .then(result => {
                _requests(result.data);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);
    return (<motion.div initial={{y: 10}} animate={{y: 0}} className={"members-container"}>
            {data ? (<div className={"font-primary"}>
                    <SendRequestPanelContainer
                        fetch={() => {
                            fetchData();
                        }}
                        groupId={props.groupId}
                    />
                    <AllRequestsPanelContainer
                        fetch={() => {
                            fetchData();
                        }}
                        requests={requests}
                    />
                </div>) : (<Spinner/>)}
        </motion.div>);
}

function SendRequestPanelContainer({
                                       groupId, fetch,
                                   }: {
    groupId: number; fetch: () => void;
}) {
    const [email, _email] = useState<string>("");
    const [loading, _loading] = useState<boolean>(false);
    const [message, _message] = useState<string | null>(null);
    const [isAdmin, _setAdmin] = useState<boolean>(false);
    const [role, setRole] = useState<Role | null>(null);

    function handleSendInvite() {
        if (!loading) {
            if (validateEmail(email)) {
                _loading(true);
                _props
                    ._db(service.group)
                    .query(serviceRoute.groupInvite, {
                        requestee: email, role: isAdmin ? "ADMIN" : "MEMBER",
                    }, reqType.post, groupId)
                    .then(result => {
                        _message(result.message);
                        fetch();
                        _email("");
                        _loading(false);
                    })
                    .catch(error => {
                        _loading(false);
                        console.log(error);
                    });
            } else {
                _message("Please enter a valid email");
            }
        }
    }

    useEffect(() => {
        _props
            ._db(service.group)
            .query(serviceRoute.groupRole, {}, reqType.get, groupId)
            .then((result: { data: Role }) => {
                setRole(result.data);
            });
    }, []);

    const {size: isSmall} = useWindowSize(EwindowSizes.S);

    return (<>
            {message && (<Snackbar
                    message={message}
                    onClose={() => {
                        _message(null);
                    }}
                />)}
            <form
                onSubmit={(e: React.FormEvent) => {
                    e.preventDefault();
                    handleSendInvite();
                }}
            >
                <div
                    className={isSmall ? "requestWrapper _MrequestWrapper" : "requestWrapper"}
                >
                    <div className={"inputWrapper"}>
                        <input
                            required={true}
                            type={"email"}
                            value={email}
                            onKeyUp={e => {
                                if (e.key === "Enter") {
                                    handleSendInvite();
                                }
                            }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                _email(e.target.value);
                            }}
                            placeholder={"Please enter the email to send an invite"}
                            className={"sendInviteInput"}
                        />
                    </div>
                    {role?.type === "OWNER" && (<div
                            className={isSmall ? "admin-panel _Madmin-panel" : "admin-panel"}
                        >
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={isAdmin}
                                    onClick={() => {
                                        _setAdmin(!isAdmin);
                                    }}
                                />
                                <span className="slider round"></span>
                            </label>
                            <div>Invite as admin</div>
                        </div>)}

                    <div className={"sendInviteBtn"}>
                        <button type={'submit'}
                            className={"btn btn-primary btn-custom"}
                        >
                            {"Invite"}
                        </button>
                    </div>
                    {loading && <Spinner/>}
                </div>
            </form>
        </>);
}

function AllRequestsPanelContainer({
                                       requests, fetch,
                                   }: {
    fetch: () => void; requests: Request[] | null;
}) {
    const [allRequests, _requests] = useState<Request[] | null>(requests);
    const [message, _message] = useState<string | null>(null);
    useEffect(() => {
        _requests(requests);
    }, [requests]);

    function handleDelete(requestId: string) {
        _props
            ._db(service.group)
            .query(serviceRoute.groupInvite, {}, reqType.delete, requestId)
            .then(response => {
                fetch();
                _message(response.message);
            });
    }

    function handleGroupJoin(requestId: string) {
        _props
            ._db(service.group)
            .query(serviceRoute.request, {}, reqType.put, requestId)
            .then((response: any) => {
                fetch();
                _message("Request accepted.");
            });
    }

    return (<>
            {allRequests ? (<>
                    {message && (<Snackbar
                            message={message}
                            onClose={() => {
                                _message(null);
                            }}
                        />)}
                    {allRequests.map((item: Request, index: number) => (
                        <div className={"shadow userlistWrapper"} style={{justifyContent:'space-between'}} key={index}>
                            <div> {item.invitee}</div>

                            <div className={"flex"}>
                                {item.type === "INVITE" ? (<>
                                        {item.status === "PENDING" && (<Tooltip text={"Request is pending"}>
                                                {" "}
                                                <SiMinutemailer size={26} color={"white"}/>
                                            </Tooltip>)}
                                        {item.status === "REJECTED" && (<Tooltip text={"Request is rejected"}>
                                                {" "}
                                                <RiCloseCircleLine size={26} color={"yellow"}/>
                                            </Tooltip>)}
                                        {item.status === "BLOCKED" && (<Tooltip text={"Request is blocked by user"}>
                                                {" "}
                                                <GoBlocked size={26} color={"red"}/>
                                            </Tooltip>)}
                                    </>) : (<div
                                        onClick={() => {
                                            handleGroupJoin(item.id);
                                        }}
                                    >
                                        <div className={'btn btn-round-primary'} style={{padding:'4px 10px'}}>Accept</div>
                                    </div>)}

                                <div style={{margin: "2px 10px"}}>
                                    <MdDelete color={'white'}
                                        onClick={() => {
                                            handleDelete(item.id);
                                        }}
                                        size={26}
                                    />
                                </div>
                            </div>
                        </div>))}
                </>) : (<div className={"noRequestWrapper"}>No active requests yet!</div>)}
        </>);
}

interface Request {
    groupId: number;
    id: string;
    invitee: string;
    userId: number;
    status: "ACCEPTED" | "PENDING" | "REJECTED" | "BLOCKED";
    type: "INVITE" | "MANUAL" | "DELETE";
}
