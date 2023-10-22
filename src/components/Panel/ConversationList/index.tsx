import React, {useContext, useEffect, useState} from 'react';
import './index.css'
import {GroupIcon} from "../GroupsPanel";
import {ShellContext} from "../../../services/context/shell.context";
import {_props, reqType, service, serviceRoute} from "../../../services/network/network";

export function GroupList() {
    const [items,setItem] = useState([])
    const {_setGroupId} = useContext(ShellContext);
    const {trigger} = useContext(ShellContext);

    useEffect(() => {
        _props._db(service.group).query(serviceRoute.group,undefined,reqType.get).then(response=>{
           setItem(response.data)
        })
    }, []);
    const handleGroupSelection = (groupId:string) : void=>{
      _setGroupId(groupId);
    }
    useEffect(() => {
        if(trigger){
            _props._db(service.group).query(serviceRoute.group,undefined,reqType.get).then(response=>{
                setItem(response.data)
            })
        }
    }, [trigger]);
    return (<>
        {items.map((item : any) =>
            <div className={'groupListContainer shadow-box '} onClick={()=>handleGroupSelection(item.id)}>
                <div className={' groupLogo'}><GroupIcon/></div>
                <div className={'info'}>
                    <div style={{fontSize:'14px'}}>{item.name}</div>
                    <div className={'flex conversationWrapper'} >{
                        item.GroupDetail.tags.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, key:number) =>
                            <div key={key} className={'keyword-tag'}>{item}</div>
                        )
                    }</div>
                </div>
                <div className={' activity font-secondary'}>{item.pendingCount && `+${item.pendingCount}`}</div>
            </div>
        )}
    </>)
}