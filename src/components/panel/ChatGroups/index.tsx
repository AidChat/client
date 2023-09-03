import React from 'react';
import groupsImg from './../../../assets/svg/groups.svg';
import './index.css'
export function ChatGroups() {
    let groups = [1, 2, 4, 45, 3, 2, 1];
    return (
        <div className={'group-item-container'}>
            {groups.map(item=>
                <div className={'item-wrapper'}>
                    <img src={groupsImg} alt={'profile icon'} />
                </div>
            )}
        </div>
   )
}