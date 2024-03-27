import {MyReminders} from "./MyReminders";
import {ReminderForm} from "./ReminderForm";
import './groupreminder.moodule.css'
import {_props} from "../../../../services/network/network";
import {reqType, service, serviceRoute} from "../../../../utils/enum";
import {IReminder} from "../../../../utils/interface";
import {useContext, useEffect, useState} from "react";
import {ShellContext} from "../../../../services/context/shell.context";
export function GroupReminder({groupId}:{groupId:number}) {
    const [reminders,setReminders] = useState<{myReminders:IReminder[],otherReminders:IReminder[]}>({myReminders:[],otherReminders:[]})
    const {userId} = useContext(ShellContext);
    useEffect(() => {
        fetchData()
    }, []);
    function fetchData() {
        _props._db(service.group).query(serviceRoute.groupReminders, undefined, reqType.get, groupId)
            .then(function ({data}) {
                let myReminders = data.filter((item: IReminder) => item.createdById === userId);
                let others: IReminder[] = [];
                data.map((item: IReminder) => {
                    item?.participants?.users?.map(e => {
                        if (e.id === userId) others.push(item)
                    })
                })
                console.log(myReminders, others)
                setReminders({myReminders: myReminders, otherReminders: others});
            })
    }
    return <div className={'h100'} style={{overflowY:'auto'}}>
        <ReminderForm refetch={fetchData} groupId={groupId} />
        <MyReminders reminders={reminders} fetchData={()=>fetchData()}  groupId={groupId} />
    </div>
}