import React from 'react';
import './index.css'
import {GroupIcon} from "../GroupsPanel";

export function GroupLists() {
    const items = [
        {key:1,name: 'Alpha Group', pendingCount: 10, keywords: ['Comedy', 'Science', 'Fiction']},
        {key:2,name: 'Alpha Group', pendingCount: 2, keywords: ['Comedy', 'Science', 'Fiction']},
        {key:3,name: 'Alpha Group', pendingCount: 14, keywords: ['Comedy', 'Science', 'Fiction']},
        {key:4,name: 'Alpha Group', pendingCount: null, keywords: ['Comedy', 'Science', 'Fiction']},
    ];
    return (<>
        {items.map(item =>
            <div className={'groupListContainer '}>
                <div className={' groupLogo'}><GroupIcon/></div>
                <div className={'info'}>
                    <div>{item.name}</div>
                    <div className={'flex'}>{
                        item.keywords.map((item,key) =>
                            <div key={key} className={'keyword-tag'}>{item}</div>
                        )
                    }</div>
                </div>
                <div className={' activity font-secondary'}>{item.pendingCount && `+${item.pendingCount}`}</div>
            </div>
        )}
    </>)
}