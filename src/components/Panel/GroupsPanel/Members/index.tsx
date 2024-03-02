import React, {useEffect, useState} from "react";
import {Spinner} from "../../../Utils/Spinner/spinner";
import {_props} from "../../../../services/network/network";
import './index.css';
import {reqType, service, serviceRoute} from "../../../../utils/enum";

interface User {
    email: string,
    id: number,
    name: string,
    Role:{
        id:number,
        type:'OWNER' | "ADMIN" | 'MEMBER'
    }[]
}

export function Members(props: { groupId: string }) {
    const [data, setData] = useState(true);
    const [users, _users] = useState<User[] | []>([]);
    useEffect(() => {
        _props._db(service.group).query(serviceRoute.groupUsers, {}, reqType.get, props.groupId)
            .then(result => {
                _users(result.data.User);
            })
    }, []);
    return (
        <div className={'members-container'}>
            {
                data ?
                    <div className={'font-primary'}>
                        {
                            users?.map((item: User) => UsersList({user: item}))
                        }
                    </div>
                    : <Spinner/>
            }
        </div>
    )
}

function UsersList({user}: { user: User }) {
    return (
        <div className={'shadow userlistWrapper'}>
            <div> {user.name}</div>
            <div>
                {ClientRole[user?.Role[0]?.type]}
            </div>
        </div>
    )
}

enum ClientRole{
    OWNER = 'GROUP OWNER',
    ADMIN = 'ADMIN',
    MEMBER = 'PARTICIPANT'
}