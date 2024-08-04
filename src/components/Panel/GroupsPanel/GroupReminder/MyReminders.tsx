import React, {ReactElement, useState} from "react";
import {EwindowSizes, reqType, service, serviceRoute} from "../../../../utils/enum";
import {_props} from "../../../../services/network/network";
import {IReminder} from "../../../../utils/interface";
import {formatTime, formatTimeToHHMM} from "../../../../utils/functions";
import {CiUser} from "react-icons/ci";
import {Menu} from "../../../Utils/Menu";
import {useWindowSize} from "../../../../services/hooks";
import {MdDelete} from "react-icons/md";
import Snackbar from "../../../Utils/Snackbar";

export function MyReminders({reminders,fetchData}: { groupId: number,reminders:{myReminders:IReminder[] ,otherReminders:IReminder[]},fetchData:()=>void}): ReactElement {
    return (<>
        <div
            className={"font-primary mygroup-label "}
        >
            MY REMINDERS
        </div>
        {reminders.myReminders.length > 0 ? reminders.myReminders.map(function (reminder: IReminder) {
            return <ReminderBar refetch={()=>fetchData()} reminder={reminder} self={true}/>
        }) : <div className={'center w100 font-primary'}>You haven't created any reminders yet.</div>}
        <div
            className={"font-primary mygroup-label "}
            style={{}}
        >
            OTHER REMINDERS
        </div>
        {reminders.otherReminders.length > 0 ? reminders.otherReminders.map(function (reminder: IReminder) {
            return <ReminderBar refetch={()=>fetchData()} reminder={reminder} self={false}/>
        }) : <div className={'center w100 font-primary'}>No reminders!</div>}
    </>)
}

export function ReminderBar(props: { reminder: IReminder, self: boolean, refetch: () => void }) {
    let {size: isSmall} = useWindowSize(EwindowSizes.S);
    let [message, _message] = useState('')

    function handleSelect(item: any) {
        handleRemove()
    }

    function handleRemove() {
        if (props.self) _props._db(service.group).query(serviceRoute.reminder, {}, reqType.delete, props.reminder.id).then(function () {
            _message("Reminder removed");
            props.refetch();
        })
        else
            _props._db(service.group).query(serviceRoute.removeReminder, {},reqType.put,props.reminder.id).then(function(response){
                _message("You have been removed from this reminder")
                props.refetch();
            })
    }

    return <div style={{position: 'relative'}} className={'reminderBarWrapper'}>
        <Snackbar message={message} onClose={() => _message('')}/>
        <div className={'shadow userlistWrapper '}>
            <div className={'w25'}>{props.reminder.title}</div>
            <div className={'dflex flex-row w50'}>{props.reminder.recurringDays.map((day: string) => <div
                className={'token-days'}>{day}</div>)}</div>
            { !isSmall &&  <div className={'w50 dlfex'} style={{textAlign: 'right', margin: '0 6px'}}><CiUser color={'white'}/>
                {props.reminder.createdBy?.name}</div>
            }
            <div className={'w25'}>{formatTimeToHHMM(props.reminder.when)}</div>
            {<MdDelete onClick={handleRemove} size={22} color={'#510707'}/>}
        </div>
    </div>
}