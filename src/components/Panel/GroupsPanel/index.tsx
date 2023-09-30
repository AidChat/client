import React from 'react';
import groupsImg from './../../../assets/svg/groups.svg';
import './index.css'
export function ChatGroups() {
    let groups : any[] = [];
    return (
        <div className={'group-item-container '}>
            {groups.map((_item,idx)=>
                <div className={'groupIcon-container-wrapper'} key={idx}>
                <GroupIcon/>
                </div>
            )}
        </div>
   )
}

export function GroupIcon(){
    return (
        <div className={'item-wrapper'}>
            <img src={groupsImg} alt={'profile icon'} />
        </div>
    )
}