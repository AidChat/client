import React, {useContext, useEffect, useState} from 'react';
import './index.css'
import {GroupIcon} from "../../GroupsPanel";
import {ShellContext} from "../../../../services/context/shell.context";
import {_props, reqType, service, serviceRoute} from "../../../../services/network/network";
import {formatDateToDDMMYYYY} from "../../../../utils/functions";

export interface GroupListInterface {
    GroupDetail:{
        icon:string,
        tags:string[]
    },
    name:string,
    id:number,
    Message ?:{
        status:string
    }[]
}

export function GroupList({items,listType}:{items:GroupListInterface[] | [],listType:string}) {
    const {_setGroupId,_setGroupType} = useContext(ShellContext);

    const handleGroupSelection = (groupId: string): void => {
        _setGroupId(groupId);
        _setGroupType(listType)
    }

    return (<>

        {items.map((item: any, key: number) =>
            <div key={key} className={'groupListContainer shadow-box '} onClick={() => handleGroupSelection(item.id)}>
                <div className={'groupLogo'}><GroupIcon url={item.GroupDetail.icon}/></div>
                <div className={'info'}>
                    <div style={{fontSize: '14px'}}>{item.name}</div>
                    <div className={'flex conversationWrapper'}>{
                        item.GroupDetail.tags.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, key: number) =>
                            <div key={key} className={'keyword-tag'}>{item}</div>
                        )
                    }</div>
                </div>
                {item.Message &&
                <div style={{width:'10%'}}>
                    <div
                        className={'font-primary'} style={{fontWeight:'bold',fontSize:'11px'}}>{item.Message.length > 0 && formatDateToDDMMYYYY(item.Message[item.Message.length - 1].created_at)}</div>
                    <div
                        className={' activity font-secondary'}>{item.Message && `+${item.Message.filter((item: any) => item.status === 'DELIVERED').length}`}</div>
                </div>
                }
            </div>
        )}
    </>)
}