import React, {useEffect, useState} from "react";
import {Spinner} from "../../../utility/spinner/spinner";
import './index.css'
import {_props, reqType, service, serviceRoute} from "../../../../services/network/network";
import Snackbar from "../../../utility/Snackbar";
import ImageUploader from "react-images-upload";
import groupIcon from './../../../../assets/svg/groups.svg'

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
    const [state, setState] = useState<{ name: string, description: string,id:number,icon?:string     }>({
        name: props.groupDetails.name,
        description:props.groupDetails.GroupDetail.description,
        id:props.groupDetails.id,
        icon:props.groupDetails.GroupDetail.icon
    });
    const [update,_update]= useState<{icon:boolean}>({icon:false})
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
        const data = {...state};
        if(!update.icon){
            delete data.icon
        }
        _props._db(service.group).query(serviceRoute.group, data, reqType.put, props.groupDetails.id)
            .then(result => {
                _loading(false);
                _message('Group updated successfully')
            })
            .catch(error=>{
               _message("Failed to update group");
            })
    }
    function handleImageUpload(e:any){
        const file = e[0];
        const reader = new FileReader();
        reader.onloadend = function () {
            if (reader && reader.result) {
                if (typeof reader.result === "string") {
                    const base64String = reader.result;
                    setState({...state, icon: base64String});
                    _update({icon:true});
                }
            }
        };
        reader.readAsDataURL(file);
    }

    return (
        <>
            {message && <Snackbar message={message} onClose={()=>{_message(null)}} />}
            {loading && <Spinner/>}
            <div className={'groupContainer'}>
                <div className={'settings-item-container profileContainer'}>
                    <div className={'groupIconWrapper'}>
                        <img  style={{height:'100%',width:'100%'}} src={state.icon? state.icon : groupIcon} alt={'group icon'} />
                    </div>
                    <ImageUploader
                        className={'imageUploader'}
                        withIcon={false}
                        singleImage={true}
                        buttonText='Update'
                        label={''}
                        onChange={(e) => {
                            handleImageUpload(e)
                        }}
                        imgExtension={['.jpeg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                    />
                </div>
                <div className={'settings-item-container nameContainer'}>
                    <div className={'center w25'}>Name</div>
                    <input className={`settingInput w50 ${!isOwner && 'borderNone' } `} onChange={handleUpdate} name={'name'}
                           value={state.name} disabled={!isOwner}/>
                </div>
                <div className={'settings-item-container descContainer'}>
                    <div className={'center w25'}>Description</div>
                    <textarea className={`settingInput w100 ${!isOwner && 'borderNone'} `} onChange={handleUpdate} name={'description'}
                              disabled={!isOwner}
                              value={state.description}/>

                </div>
                <div className={'settings-item-container tagContainer'}>
                    <div className={'center w25'}>Group Tags</div>
                    <div className={'tagWrapper'}>{props.groupDetails.GroupDetail.tags.map((tag)=>{
                        return <div className={'tag'}>
                            {tag}
                        </div>
                    })}</div>
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
        tags: string[],
        icon:string
    }
    Role: {
        id: number,
        type: "MEMBER" | 'OWNER' | 'ADMIN'
    }[]
}