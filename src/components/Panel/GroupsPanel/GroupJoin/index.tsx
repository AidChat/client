import {useContext, useEffect, useState} from "react";
import {ShellContext} from "../../../../services/context/shell.context";
import {_props, reqType, service, serviceRoute} from "../../../../services/network/network";
import {Spinner} from "../../../utility/spinner/spinner";
import groupsImg from "../../../../assets/svg/groups.svg";
import Tooltip from "../../../utility/Tooltip";
import Snackbar from "../../../utility/Snackbar";

export function InviteContainer(props: { requestId?: string, groupId?: string }) {
    const [loading, _loading] = useState<boolean>(true);
    const [data, _data] = useState<any>(null);
    const {_setGroupType, _setRefetch, refetch} = useContext(ShellContext);
    const [message,_message]= useState<string>('');
    useEffect(() => {
        if (props.requestId) {
            _loading(true);
            _props._db(service.group).query(serviceRoute.request, {}, reqType.get, props.requestId)
                .then(result => {
                    _data(result.data);
                    _loading(false);
                })
        }
    }, [props.requestId, props.groupId]);

    function handleGroupJoin() {
        if (props.requestId) {
            _loading(true);
            _props._db(service.group).query(serviceRoute.request, {}, reqType.put, props.requestId)
                .then(() => {
                    _message("Request has been sent. You will get notified once you will be allowed to join.")
                    _loading(false)
                    _setRefetch(!refetch)
                    _setGroupType('CHAT');
                })
        }
    }

    function handleInviteReject() {
        _loading(true);
        _props._db(service.group).query(serviceRoute.groupInvite, {status: "REJECTED"}, reqType.put, props.requestId)
            .then(result => {
                _loading(false);
                _setRefetch(!refetch)
                _setGroupType(null);
            })
    }

    function handleRequestBlock() {
        _loading(true)
        _props._db(service.group).query(serviceRoute.groupInvite, {status: data.status === "BLOCKED" ? "PENDING" : "BLOCKED"}, reqType.put, props.requestId)
            .then(result => {
                _loading(false);
                _setRefetch(!refetch)
                _setGroupType(null);
            });
    }

    return (
        <div className={'inviteContainer'}>
            <Snackbar message={message} onClose={()=>{_message('')}} />
            {loading ? <Spinner/> :
                <>
                    <div className={'inviteWrapper'}>
                        <div className={'invContainer'}>
                            <div className={'font-primary inviteHeading'}>Group Invitation</div>
                            <div className={'groupIcon_wrapper_container'}>
                                <div className={'groupIcon_wrapper'}>
                                    <img style={{
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: '50%',
                                        border: '1px solid lightgrey'
                                    }} src={data.group.GroupDetail.icon ? data.group.GroupDetail.icon : groupsImg}
                                         alt={'Group image'}/>
                                </div>
                            </div>
                            <div className={'label font-primary'}>NAME</div>
                            <div className={'font-secondary invite-labels'}> {data.group.name} </div>
                            <div className={'font-primary '}>DESCRIPTION</div>
                            <div className={'font-secondary invite-labels'}>{data.group.GroupDetail.description}</div>
                            <div className={'font-primary'}>TAGS</div>
                            <div className={'tag-container '}>{data.group.GroupDetail.tags.map((item: string) => {
                                return <div className={'tag'}>{item}</div>
                            })}
                            </div>
                            <div className={'font-primary'}>REQUESTER</div>
                            <div className={'font-secondary invite-labels'}>{data.user.name}</div>
                            <div style={{display: 'flex'}}>
                                <div className={'btn-Wrapper'}>
                                    {data.status !== "BLOCKED" && <>
                                        <div onClick={() => {
                                            handleInviteReject()
                                        }}
                                             className={'btn btn-primary btn-custom'}>{!props.requestId ? "NOT INTERESTED" : "NOT INTERESTED"}</div>

                                        <div onClick={() => {
                                            handleGroupJoin()
                                        }}
                                             className={'btn btn-primary btn-custom'}>{!props.requestId ? "JOIN" : "I AM INTERESTED"}</div>
                                    </>
                                    }
                                </div>

                                <Tooltip text={data.status === "PENDING" ? "Block this group from sending request." : "Unblock request."}>
                                    <div onClick={() => {
                                        handleRequestBlock()
                                    }}
                                         className={'font-primary block-text'}>{data.status === "BLOCKED" ? "Unblock ?" : "Block ?"}
                                    </div>
                                </Tooltip>
                            </div>

                        </div>
                    </div>
                </>
            }
        </div>
    )
}