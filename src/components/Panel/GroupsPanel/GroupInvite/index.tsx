import {useContext, useEffect, useState} from "react";
import {ShellContext} from "../../../../services/context/shell.context";
import {_props} from "../../../../services/network/network";
import {Spinner} from "../../../Utils/Spinner/spinner";
import groupsImg from "../../../../assets/svg/groups.svg";
import Tooltip from "../../../Utils/Tooltip";
import Snackbar from "../../../Utils/Snackbar";
import {EwindowSizes, reqType, service, serviceRoute,} from "../../../../utils/enum";
import {useWindowSize} from "../../../../services/hooks";
import {FaRegThumbsDown, FaThumbsUp} from "react-icons/fa6";
import {MdBlock} from "react-icons/md";
import {UserAnalysis} from "../../../UserAnalysis";
import {confirm} from "../../../../utils/functions";

export function InviteContainer(props: {
    requestId?: string;
    groupId?: string;
    type: "INVITE" | "JOIN";
}) {
    const [loading, _loading] = useState<boolean>(true);
    const [data, _data] = useState<any>(null);
    const {_setGroupType, _setRefetch, refetch} = useContext(ShellContext);
    const [message, _message] = useState<null | string>(null);
    const [userAnalysis, setUserAnalysis] = useState<{
        at: Date,
        sentiments: string,
        evaluation: string,
        username: string
    }[] | []>([]);
    useEffect(() => {

        if (props.type === "INVITE") {
            _loading(true);
            if (props.requestId) {
                _props
                    ._db(service.group)
                    .query(serviceRoute.request, undefined, reqType.get, props.requestId)
                    .then(result => {
                        _data(result.data);
                        _loading(false);
                    });
            }
        }
        if (props.type === "JOIN") {
            fetchGroupJoinDetails();
        }
    }, [props.requestId, props.groupId]);

    function fetchGroupJoinDetails() {
        _props
            ._db(service.group)
            .query(serviceRoute.groupById, {}, reqType.get, props.groupId)
            .then(({data}) => {
                console.log(data)
                _data({
                    group: data,
                    user: data.User,
                    request: data.Request,
                });
                const users = data.User;
                const analysisReport: {
                    at: Date,
                    sentiments: string,
                    username: string,
                    evaluation: string,
                }[] = [];
                users?.forEach((user: any) => {
                    if (user.Analysis.length) {
                        user.Analysis.forEach((item: any) => {
                            const analysis = JSON.parse(item.analysis);
                            analysisReport.push({
                                at: item.created_at,
                                username: user.Username,
                                sentiments: analysis.sentiment,
                                evaluation: analysis.evaluation
                            });
                        })
                    }
                })
                setUserAnalysis(analysisReport);
                _loading(false);
            });
    }

    async function handleGroupJoinRequest() {
        _loading(true);
        if (data?.request[0]?.id) {
            confirm({
                message: "Doing so will send a request to client. Do you want to continue",
                header: "Please confirm"
            })
                .then(async function () {
                    let response = await _props
                        ._db(service.group)
                        .query(
                            serviceRoute.updateInvite,
                            {status: "REJECTED"},
                            reqType.delete,
                            data.request[0].id
                        );
                    fetchGroupJoinDetails();
                    _loading(false);
                    _message(response.message);
                })
        } else {
            try {
                let response = await _props
                    ._db(service.group)
                    .query(serviceRoute.groupInvite, {}, reqType.post, data.group.id);
                fetchGroupJoinDetails();
                _loading(false);
                _message(response.message);
            } catch (e) {
                _message("Failed");
            }
        }
    }

    function handleGroupJoin() {
        let d = null;
        if (data?.request?.length > 0) {
            d = data?.request[0];
        }

        if (d) {
            _loading(true);
            _props
                ._db(service.group)
                .query(
                    serviceRoute.updateInvite,
                    {status: "REJECTED"},
                    reqType.delete,
                    d.id
                )
                .then(() => {
                    _message("Join request has been removed");
                    _loading(false);
                    _setRefetch(!refetch);
                    _setGroupType(null);
                });
        } else {
            _loading(true);
            _props
                ._db(service.group)
                .query(serviceRoute.request, {}, reqType.put, props.requestId)
                .then(result => {
                    fetchGroupJoinDetails();
                    _loading(false);
                    _message(result.message);
                });
        }
    }

    function handleInviteReject() {
        _loading(true);
        _props
            ._db(service.group)
            .query(
                serviceRoute.groupInvite,
                {status: "REJECTED"},
                reqType.put,
                props.requestId
            )
            .then(result => {
                _loading(false);
                _setRefetch(!refetch);
                _setGroupType(null);
            });
    }

    function handleRequestBlock() {
        _loading(true);
        _props
            ._db(service.group)
            .query(
                serviceRoute.groupInvite,
                {status: data.status === "BLOCKED" ? "PENDING" : "BLOCKED"},
                reqType.put,
                props.requestId
            )
            .then(result => {
                _message("Request blocked");
                _loading(false);
                _setRefetch(!refetch);
            });
    }

    const {size: isSmall} = useWindowSize(EwindowSizes.S);
    return (
        <div className={"inviteContainer"}>
            {message && (
                <Snackbar
                    message={message}
                    onClose={() => {
                        _message(null);
                    }}
                />
            )}
            {loading ? (
                <Spinner/>
            ) : (
                <>
                    <div className={"inviteWrapper h100 _scrollable-container"}>
                        <div className={"invContainer "}>
                            <h4 className={"font-primary inviteHeading"}>
                                GROUP {props.type === "INVITE" ? "INVITATION" : "JOIN"}
                            </h4>
                            <div className={"groupIcon_wrapper_container"}>
                                <div className={"groupIcon_wrapper"}>
                                    <img
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            borderRadius: "4px",
                                        }}
                                        src={
                                            data?.group.GroupDetail.icon
                                                ? data?.group.GroupDetail.icon
                                                : groupsImg
                                        }
                                        alt={"Group image"}
                                    />
                                </div>
                            </div>
                            <div className={"label font-secondary item-label"}>NAME</div>
                            <div className={" font-primary invite-labels font-large"}>
                                {" "}
                                {data.group.name}{" "}
                            </div>
                            <div className={" font-secondary item-label"}>DESCRIPTION</div>
                            <div className={" font-primary invite-labels font-medium"}>
                                {data.group.GroupDetail.description}
                            </div>
                            <div className={"font-secondary item-label"}>TAGS</div>
                            <div className={"tag-container "}>
                                {data.group.GroupDetail.tags.map((item: string) => {
                                    return <div className={"tag font-small"}>{item}</div>;
                                })}
                            </div>
                            <div className={"_scrollable-container analysis-container "}>
                                <UserAnalysis data={userAnalysis}/>
                            </div>
                            {data.user.name ? (
                                <>
                                    <div className={"font-secondary label item-label"}>REQUESTER</div>
                                    <div className={"font-primary invite-labels"}>
                                        {data.user.name}
                                    </div>
                                </>
                            ) : (
                                <>{props.type !== 'JOIN' &&
                                    <>
                                        <div className={"font-secondary label item-label"}>CURRENT USERS</div>
                                        <div className={" font-primary invite-labels"}>
                                            {data.user.length} Active{" "}
                                            {data.user.length > 1 ? "users" : "user"}
                                        </div>
                                    </>
                                }
                                </>
                            )}
                            {props.type === "INVITE" ? (
                                <div style={{display: "flex"}}>
                                    <div className={"btn-Wrapper"}>
                                        {data.status !== "BLOCKED" && (
                                            <>
                                                <div
                                                    onClick={() => {
                                                        handleInviteReject();
                                                    }}
                                                    className={"btn btn-primary btn-custom"}
                                                >
                                                    {!isSmall ? "Remove" : <FaRegThumbsDown/>}
                                                </div>

                                                {data.type !== "MANUAL" && (
                                                    <div
                                                        onClick={() => {
                                                            handleGroupJoin();
                                                        }}
                                                        className={"btn btn-primary btn-custom"}
                                                    >
                                                        {!isSmall ? "Join" : <FaThumbsUp/>}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {data.type !== "MANUAL" && (
                                            <Tooltip
                                                text={
                                                    data.status === "PENDING"
                                                        ? "Block this group from sending request."
                                                        : "Unblock request."
                                                }
                                            >
                                                <div
                                                    onClick={() => {
                                                        handleRequestBlock();
                                                    }}
                                                    className={" btn font-primary block-text"}
                                                >
                                                    {data.status === "BLOCKED" ? (
                                                        "Unblock ?"
                                                    ) : !isSmall ? (
                                                        "Block"
                                                    ) : (
                                                        <MdBlock/>
                                                    )}
                                                </div>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>{data.request.length === 0 ?
                                    <div style={{display: "flex"}}>
                                        <div className={"btn-Wrapper"}>
                                            <div
                                                onClick={() => {
                                                    handleGroupJoinRequest();
                                                }}
                                                className={"btn btn-round-secondary "}
                                            >
                                                Request to join
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className={'font-secondary'} style={{textDecoration: "underline"}}>
                                        Request has been sent to client by you.
                                    </div>
                                }
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
