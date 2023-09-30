import React from 'react';
import './index.css'
import {GroupIcon} from "../GroupsPanel";

export function GroupLists() {
    let items : any = [];
    items = items.concat(items);
    items = items.concat(items);
    return (<>
        {items.map((item: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; keywords: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactPortal | Iterable<React.ReactNode> | null | undefined)[]; pendingCount: any; }) =>
            <div className={'groupListContainer '}>
                <div className={' groupLogo'}><GroupIcon/></div>
                <div className={'info'}>
                    <div>{item.name}</div>
                    <div className={'flex conversationWrapper'} >{
                        item.keywords.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, key: React.Key | null | undefined) =>
                            <div key={key} className={'keyword-tag'}>{item}</div>
                        )
                    }</div>
                </div>
                <div className={' activity font-secondary'}>{item.pendingCount && `+${item.pendingCount}`}</div>
            </div>
        )}
    </>)
}