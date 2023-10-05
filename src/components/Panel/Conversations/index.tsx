import React, {useEffect, useState} from 'react';
import './index.css'
import {GroupIcon} from "../GroupsPanel";
import {_props, reqType, service, serviceRoute} from "../../../services/network";

export function GroupLists() {
    const [items,setItem] = useState([])
    useEffect(() => {
        _props._db(service.group).query(serviceRoute.group,undefined,reqType.get).then(response=>{
            setItem(response.data)
        })
    }, []);
    console.log(items)
    return (<>
        {items.map((item : any) =>
            <div className={'groupListContainer '}>
                <div className={' groupLogo'}><GroupIcon/></div>
                <div className={'info'}>
                    <div>{item.name}</div>
                    <div className={'flex conversationWrapper'} >{
                        item.GroupDetail.tags.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, key: React.Key | null | undefined) =>
                            <div key={key} className={'keyword-tag'}>{item}</div>
                        )
                    }</div>
                </div>
                <div className={' activity font-secondary'}>{item.pendingCount && `+${item.pendingCount}`}</div>
            </div>
        )}
    </>)
}