import {useContext, useEffect, useState} from "react";
import {ShellContext} from "../../../../services/context/shell.context";
import {_props, reqType, service, serviceRoute} from "../../../../services/network/network";
import {Spinner} from "../../../utility/spinner/spinner";
import groupsImg from "../../../../assets/svg/groups.svg";
import Tooltip from "../../../utility/Tooltip";

export function InviteContainer(props: { requestId?: string, groupId?: string, type: "INVITE" | "JOIN" }) {
    const [loading, _loading] = useState<boolean>(true);
    const [data, _data] = useState<any>(null);
    const {_setGroupType, _setRefetch, refetch} = useContext(ShellContext);
    useEffect(() => {
        if (props.type === 'INVITE') {
            _loading(true);
            console.log(props.requestId)
            if (props.requestId) {
                _props._db(service.group).query(serviceRoute.request, undefined, reqType.get, props.requestId)
                    .then(result => {
                        console.log(result.data);
                        _data(result.data);
                        _loading(false);
                    })
            }
        }
        if (props.type === 'JOIN') {
            fetchGroupJoinDetails();
        }
    }, [props.requestId, props.groupId]);

    function fetchGroupJoinDetails(){
        _props._db(service.group).query(serviceRoute.groupById, {}, reqType.get, props.groupId)
            .then(result => {
                console.log(result)
                _data({group: result.data, user: result.data.User,request:result.data.Request});
                _loading(false);
            })
    }

    function handleGroupJoin() {
        if (props.requestId) {
            _loading(true);
            _props._db(service.group).query(serviceRoute.request, {}, reqType.put, props.requestId)
                .then(() => {
                    _loading(false)
                    _setRefetch(!refetch)
                    _setGroupType('CHAT');
                })
        } else {
            _loading(true);
                _props._db(service.group).query(serviceRoute.groupInvite, {},reqType.post,props.groupId).then(result=>{
                    console.log(result);
                    fetchGroupJoinDetails();
                    _loading(false);

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
            {loading ? <Spinner/> :
                <>
                    <div className={'inviteWrapper'}>
                        <div className={'invContainer'}>
                            <div
                                className={'font-primary inviteHeading'}>Group {props.type === 'INVITE' ? 'Invitation' : 'Join'}</div>
                            <div className={'groupIcon_wrapper_container'}>
                                <div className={'groupIcon_wrapper'}>
                                    <img style={{
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: '50%',
                                        border: '1px solid lightgrey'
                                    }} src={data?.group.GroupDetail.icon ? data?.group.GroupDetail.icon : groupsImg}
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
                            {data.user.name ? <>
                                    <div className={'font-primary label'}>REQUESTER</div>
                                    <div className={'font-secondary invite-labels'}>{data.user.name}</div>
                                </>
                                : <>
                                    <div className={'font-primary label'}>CURRENT USERS</div>
                                    <div
                                        className={'font-secondary invite-labels'}>{data.user.length} Active {data.user.length > 1 ? 'users' : 'user'}</div>
                                </>
                            }
                            {props.type === 'INVITE' ?
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

                                    <Tooltip
                                        text={data.status === "PENDING" ? "Block this group from sending request." : "Unblock request."}>
                                        <div onClick={() => {
                                            handleRequestBlock()
                                        }}
                                             className={'font-primary block-text'}>{data.status === "BLOCKED" ? "Unblock ?" : "Block ?"}
                                        </div>
                                    </Tooltip>
                                </div>


                                : <>
                                <div style={{display: 'flex'}}>

                                    <div className={'btn-Wrapper'}>
                                            <div onClick={() => {
                                                handleGroupJoin()
                                            }}
                                                 className={'btn btn-round-secondary '}>{data.request.length === 0 ? "Send Join Request" : "Cancel Request"}</div>

                                    </div>
                                </div>
                                </>}
                        </div>


                    </div>
                </>
            }
        </div>

    )
}