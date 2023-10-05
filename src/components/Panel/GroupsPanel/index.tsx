import React, {useEffect, useState} from 'react';
import groupsImg from './../../../assets/svg/groups.svg';
import './index.css'
import {_props} from "../../../services/network";

export function ChatGroups() {
    let groups: any[] = [];
    return (
        <div className={'group-item-container '}>
            <UserIcon/>
            {groups.map((_item, idx) =>
                <div className={'groupIcon-container-wrapper'} key={idx}>
                    <GroupIcon/>
                </div>
            )}
        </div>
    )
}

export function GroupIcon() {
    return (
        <div className={'item-wrapper'}>
            <img src={groupsImg} alt={'profile icon'}/>
        </div>
    )
}

export function UserIcon() {
    const [user, setUser] = useState<{ id: string, email: string, name: string } | null>(null);
    useEffect(() => {
        _props._user().get().then((result: any) => {
            let data: { id: string, email: string, name: string } = result.data;
            setUser(data)
        })
    }, []);
    return (
        user ?
            <div style={{textAlign: 'center', width: '100%'}} className={'usernameWrapper'}>
                <div style={{textAlign: 'center', height: '58px', width: 60}} className={'item-wrapper'}>
                    <img src={groupsImg} alt={'profile icon'}/>

                </div>
                <div ><h1 className={'font-primary username'}>{user.name.toUpperCase()}</h1></div>
            </div>
            : <></>

    )
}