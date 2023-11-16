import React, {useEffect, useState} from "react";
import {Spinner} from "../../../utility/spinner/spinner";
import './index.css'
import {_props, reqType, service, serviceRoute} from "../../../../services/network/network";
import Snackbar from "../../../utility/Snackbar";

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
    const [state, setState] = useState<{ name: string, description: string,id:number     }>({
        name: props.groupDetails.name,
        description:props.groupDetails.GroupDetail.description,
        id:props.groupDetails.id
    });
    const [message,_message] = useState<string | null>(null);
    const [loading, _loading] = useState<boolean>(false);
    useEffect(() => {
        if (props.groupDetails.Role[0].type === 'OWNER') {
            _updateOwnership(true);
        }else{
            _updateOwnership(false)
        }
    }, []);

    function handleUpdate(e: any) {
        setState({...state, [e.target.name]: e.target.value})
    }

    function handleGroupUpdate() {
        _loading(true);
        _props._db(service.group).query(serviceRoute.group, state, reqType.put, props.groupDetails.id)
            .then(result => {
                console.log(result)
                _loading(false);
                _message('Group updated successfully')
            })
            .catch(error=>{
                console.log(error);
               _message("Failed to update group");
            })
    }

    return (
        <>
            {message && <Snackbar message={message} onClose={()=>{_message(null)}} />}
            {loading && <Spinner/>}
            <div className={'groupContainer'}>
                <div className={'settings-item-container nameContainer'}>
                    <div className={'center w25'}>Name</div>
                    <input className={'settingInput w50'} onChange={handleUpdate} name={'name'}
                           value={state.name} disabled={!isOwner}/>
                </div>
                <div className={'settings-item-container descContainer'}>
                    <div className={'center w25'}>Description</div>
                    <textarea className={'settingInput w100'} onChange={handleUpdate} name={'description'}
                              disabled={!isOwner}
                              value={state.description}/>

                </div>
                <div className={'settings-item-container descContainer'}>
                    <div className={'center w25'}>Group Tags</div>
                </div>
                {isOwner && <>
                    <div className={'settings-item-container updateContainer'}>
                        <div className={'center w25'}></div>
                        <div>
                            <div className={'btn btn-primary btn-custom'} onClick={handleGroupUpdate}> Update</div>
                        </div>
                    </div>
                    <div className={'settings-item-container dangerContainer'}>
                        <div className={'center w25'}></div>
                        <div>
                            <div className={'btn btn-primary btn-custom'}> Request group delete</div>
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
    Role: {
        id: number,
        type: "MEMBER" | 'OWNER' | 'ADMIN'
    }[]
}