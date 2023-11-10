import React, {useEffect, useState} from "react";
import {Spinner} from "../../../utility/spinner/spinner";
import './index.css'
import {_props, reqType, service, serviceRoute} from "../../../../services/network/network";

export function Settings(props: { groupId: string }) {
    const [data, setData] = useState<GroupDetailsInt | null>(null);
    useEffect(() => {
        _props._db(service.group).query(serviceRoute.group, null, reqType.get, props.groupId)
            .then(result => {
                setData(result.data);
            })
    }, []);

    return (
        <div className={'members-container'}>
            {
                data ?
                    <div className={'font-primary'}>

                        <GroupSettingContainer groupDetails={data}/>

                    </div>
                    : <Spinner/>
            }
        </div>
    )
}

function GroupSettingContainer(props: { groupDetails: GroupDetailsInt }) {
    const [isOwner, _updateOwnership] = useState(false);
    useEffect(() => {
        _props._user().get().then((response: any) => {
            if (response.data) {
                _updateOwnership(response.data.role === 'OWNER');
            }
        })
    }, []);
    return (
        <>
            <div className={'groupContainer'}>
                <div className={'settings-item-container nameContainer'}>
                    <div className={'center w25'}>Name</div>
                    <input className={'settingInput w50'} value={props.groupDetails.name} disabled={isOwner}/>
                </div>
                <div className={'settings-item-container descContainer'}>
                    <div className={'center w25'}>Description</div>
                    <textarea className={'settingInput w100'} disabled={isOwner}
                              value={props.groupDetails.GroupDetail.description}/>

                </div>
                <div className={'settings-item-container descContainer'}>
                    <div className={'center w25'}>Group Tags</div>
                </div>
                {isOwner && <>
                    <div className={'settings-item-container updateContainer'}>
                        <div className={'center w25'}></div>
                        <div>
                            <div className={'btn btn-primary btn-custom'}> Update</div>
                        </div>
                    </div>
                    <div className={'settings-item-container dangerContainer'}>
                        <div className={'center w25'}></div>
                        <div>
                            <div className={'btn btn-primary btn-custom'}> Delete Group</div>
                        </div>
                    </div>
                </>
                }
            </div>
        </>
    )
}

interface GroupDetailsInt {
    id: number,
    name: string,
    socketId: number,
    updated_at: Date,
    userId: string[],
    GroupDetail: {
        id: number,
        description: string,
        tags: string[]
    }
}