import {useContext, useEffect, useState} from "react";
import {ShellContext} from "../../../../services/context/shell.context";
import {_props} from "../../../../services/network/network";
import {Spinner} from "../../../Utils/Spinner/spinner";
import groupsImg from "../../../../assets/svg/groups.svg";
import Tooltip from "../../../Utils/Tooltip";
import Snackbar from "../../../Utils/Snackbar";
import {
  EwindowSizes,
  reqType,
  service,
  serviceRoute,
} from "../../../../utils/enum";
import {useWindowSize} from "../../../../services/hooks/appHooks";
import {FaRegThumbsDown, FaThumbsUp} from "react-icons/fa6";
import {MdBlock} from "react-icons/md";

export function InviteContainer(props: {
  requestId?: string;
  groupId?: string;
  type: "INVITE" | "JOIN";
}) {
  const [loading, _loading] = useState<boolean>(true);
  const [data, _data] = useState<any>(null);
  const {_setGroupType, _setRefetch, refetch} = useContext(ShellContext);
  const [message, _message] = useState<null | string>(null);
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
      .then(result => {
        _data({
          group: result.data,
          user: result.data.User,
          request: result.data.Request,
        });
        _loading(false);
      });
  }

  async function handleGroupJoinRequest() {
    _loading(true);
    if (data?.request[0]?.id) {
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
        <Spinner />
      ) : (
        <>
          <div className={"inviteWrapper"}>
            <div className={"invContainer"}>
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
              <div className={"label font-primary"}>NAME</div>
              <div className={"font-secondary invite-labels"}>
                {" "}
                {data.group.name}{" "}
              </div>
              <div className={"font-primary "}>DESCRIPTION</div>
              <div className={"font-secondary invite-labels"}>
                {data.group.GroupDetail.description}
              </div>
              <div className={"font-primary"}>TAGS</div>
              <div className={"tag-container "}>
                {data.group.GroupDetail.tags.map((item: string) => {
                  return <div className={"tag"}>{item}</div>;
                })}
              </div>
              {data.user.name ? (
                <>
                  <div className={"font-primary label"}>REQUESTER</div>
                  <div className={"font-secondary invite-labels"}>
                    {data.user.name}
                  </div>
                </>
              ) : (
                <>
                  <div className={"font-primary label"}>CURRENT USERS</div>
                  <div className={"font-secondary invite-labels"}>
                    {data.user.length} Active{" "}
                    {data.user.length > 1 ? "users" : "user"}
                  </div>
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
                          {!isSmall ? "Remove" : <FaRegThumbsDown />}
                        </div>

                        {data.type !== "MANUAL" && (
                          <div
                            onClick={() => {
                              handleGroupJoin();
                            }}
                            className={"btn btn-primary btn-custom"}
                          >
                            {!isSmall ? "Join" : <FaThumbsUp />}
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
                            <MdBlock />
                          )}
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{display: "flex"}}>
                    <div className={"btn-Wrapper"}>
                      <div
                        onClick={() => {
                          handleGroupJoinRequest();
                        }}
                        className={"btn btn-round-secondary "}
                      >
                        {data.request.length === 0
                          ? "Request"
                          : "Cancel Request"}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
