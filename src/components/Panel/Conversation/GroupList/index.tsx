import React, {useContext, useEffect, useState} from 'react';
import './index.css'
import {GroupIcon} from "../../GroupsPanel";
import {ShellContext} from "../../../../services/context/shell.context";
import {formatDateToDDMMYYYY} from "../../../../utils/functions";
import {PiHandHeartFill} from "react-icons/pi";

export interface GroupListInterface {
    GroupDetail: {
        icon: string,
        tags: string[]
    },
    name: string,
    id: number,
    Message?: any,
}

export function GroupList({items, listType}: { items: GroupListInterface[] | [], listType: string }) {
    const {_setGroupId, _setGroupType} = useContext(ShellContext);

    const handleGroupSelection = (groupId: string): void => {
        _setGroupId(groupId);
        _setGroupType(listType)
    }
    const {userId} = useContext(ShellContext);
    return (<>
        {items.map((item: any, key: number) =>
            <div key={key} className={'groupListContainer shadow-box '} onClick={() => handleGroupSelection(item.id)}>
                <div className={'groupLogo'}><GroupIcon url={item.GroupDetail.icon}/></div>
                <div className={'info'}>
                    <div style={{fontSize: '16px'}}>{item?.name}</div>
                    {item.Message.length > 0 &&
                        <div style={{display: 'flex', fontSize: '13px'}}>
                            <div
                                style={{fontSize: '13px', color: 'rgb(14 151 131)'}}>{item?.Message[0]?.User.id === userId ? 'You' : item?.Message[0]?.User?.name.split(' ')[0]}
                            </div>
                            &nbsp;
                              <div
                                style={{fontSize: '13px',color:'darkgrey'}}>{item?.Message[0]?.MessageContent?.TYPE === 'TEXT' ? item?.Message[0]?.MessageContent?.content : 'Sent an image'}
                            </div>

                        </div>
                    }
                </div>
                {item.Message &&
                    <div style={{width: '22%'}}>
                        <div className={'font-primary'} style={{
                            fontWeight: 'bold',
                            fontSize: '14px',
                            color: item.Message[0].ReadReceipt[0].status === 'Sent' ? '#0e9783' : 'whitesmoke',
                            display:'flex',
                            justifyContent:'space-between'
                        }}>{item?.Message?.length > 0 && formatDateToDDMMYYYY(item.Message[item?.Message?.length - 1].created_at)}
                            {item.Message[0].ReadReceipt[0].status == 'Sent' && <PiHandHeartFill />}
                        </div>
                    </div>
                }
            </div>
        )}
    </>)
}