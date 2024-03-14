import React, {useEffect, useState} from "react";
import {Spinner} from "../../../Utils/Spinner/spinner";
import {_props} from "../../../../services/network/network";
import './index.css';
import {ClientRole, reqType, service, serviceRoute} from "../../../../utils/enum";
import {motion} from "framer-motion";

interface User {
    email: string,
    id: number,
    name: string,
    Role: {
        id: number, type: 'OWNER' | "ADMIN" | 'MEMBER'
    }[]
    selected?: boolean
}


export function GroupMemberList(props: {
    groupId: number,
    selectable?: boolean,
    onSelection ?: (T:number[]) => void
}) {
    const [data, _] = useState(true);
    const [users, _users] = useState<User[] | []>([]);
    useEffect(() => {
        _props._db(service.group).query(serviceRoute.groupUsers, {}, reqType.get, props.groupId)
            .then(result => {
                let users = result?.data.User.map((item: any) => {
                    return {
                        ...item, selected: false
                    }
                })
                _users(users);
            })
    }, []);

    function handleSelected(id: number) {
        let storedUsers = users;
        storedUsers = storedUsers.map(function (user) {
            return {
                ...user, selected: user.id === id ? !user.selected:user.selected
            }
        })
        let selectedUsers :number[] = storedUsers.filter(item=>item.selected).map(item=> item.id);
        props.onSelection &&  props.onSelection(selectedUsers)
        _users(storedUsers);

    }

    return (<motion.div transition={{delay: 0.1}} initial={{x: 10, opacity: 0}} animate={{x: 0, opacity: 1}}
                        className={'members-container'}>
        {data ? <div className={'font-primary'}>
            {users?.map((user: User) => (<div onClick={() => handleSelected(user.id)}
                                              className={user.selected ? 'shadow userlistWrapper border-light' : 'shadow userlistWrapper'}>
                <div> {user.name}</div>
                <div>
                    {ClientRole[user?.Role[0]?.type]}
                </div>
            </div>))}
        </div> : <Spinner/>}
    </motion.div>)
}


