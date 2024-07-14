import React, {useContext, useEffect, useState} from "react";
import GroupImage from "./../../../assets/png/defaultgroup.png";
import "./index.css";
import {_props} from "../../../services/network/network";
import {ShellContext} from "../../../services/context/shell.context";
import {useWindowSize,} from "../../../services/hooks/appHooks";
import {IoIosArrowForward} from "react-icons/io";
import {EwindowSizes, reqType, service, serviceRoute,} from "../../../utils/enum";
import {ProfileIconComponent} from "../../ProfileDialog";

export function UtilityPanel() {
    const {
        _requestId,
        _setGroupType,
        _setGroupId,
        refetch,
        updateSidePanelState,
    } = useContext(ShellContext);
    const [requests, _requests] = useState<any>([]);

    useEffect(() => {
        _props
            ._db(service.group)
            .query(serviceRoute.userRequest, {}, reqType.get, undefined)
            .then(result => {
                console.log(result)
                _requests(result.data);
            });
    }, [refetch]);

    function handleGroupId(id: string, requestID: string, userId: number) {

        _props._user().get().then((result) => {
            if (result.id?.toString() === userId.toString()) {
                _setGroupType("JOIN");
            } else {
                _setGroupType("INVITE");
            }
            _setGroupId(id);
            _requestId(requestID);
        })

    }

    const {size: isSmall} = useWindowSize(EwindowSizes.S);

    function close() {
        if (isSmall)
            updateSidePanelState(function (previous: {
                Group: boolean;
                Util: boolean;
            }) {
                return {
                    ...previous,
                    Util: !previous.Util,
                };
            });
    }

    return (
        <div className={"group-item-container "}>
            {isSmall && (
                <IoIosArrowForward onClick={() => close()} size="24" color="white"/>
            )}
            <ProfileIconComponent full={isSmall}/>
            {requests.length > 0 && (
                <>
                    <div
                        className={"font-primary mygroup-label flex flex-center w100"}
                        style={{fontWeight: "bolder", textAlign: "center"}}
                    >
                        REQUESTS
                    </div>
                    {requests.map((_item: any, idx: React.Key | null | undefined) => (
                        <div
                            className={"groupIcon-container-wrapper"}
                            key={idx}
                            onClick={() => {
                                handleGroupId(_item.groupId, _item.id, _item.userId);
                            }}
                        >
                            <GroupIcon
                                url={
                                    _item?.group?.GroupDetail?.icon
                                        ? _item?.group?.GroupDetail?.icon
                                        : undefined
                                }
                            />
                            <div
                                className={"font-primary truncate"}
                                style={{textAlign: "center"}}
                            >
                                {_item?.group?.name}
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export function GroupIcon({url}: { url?: string }) {
    return (
        <div className={"item-wrapper"}>
            <img src={url ? url : GroupImage} alt={"profile icon"}/>
        </div>
    );
}

