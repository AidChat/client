import React from 'react';
import './index.css'
import {GroupIcon} from "../ChatGroups";

export function GroupLists() {
    const items = [
        {name: 'Alpha Group', pendingCount: 10, keywords: ['Comedy', 'Science', 'Fiction']},
        {name: 'Alpha Group', pendingCount: 2, keywords: ['Comedy', 'Science', 'Fiction']},
        {name: 'Alpha Group', pendingCount: 14, keywords: ['Comedy', 'Science', 'Fiction']},
        {name: 'Alpha Group', pendingCount: null, keywords: ['Comedy', 'Science', 'Fiction']},
    ];
    return (<>
        {items.map(item =>
            <div className={'groupListContainer '}>
                <div className={' groupLogo'}><GroupIcon/></div>
                <div className={'info'}>
                    <div>{item.name}</div>
                    <div className={'flex'}>{
                        item.keywords.map(item =>
                            <div className={'keyword-tag'}>{item}</div>
                        )
                    }</div>
                </div>
                <div className={' activity font-secondary'}>{item.pendingCount && `+${item.pendingCount}`}</div>
            </div>
        )}
    </>)
}