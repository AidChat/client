import {MyReminders} from "./MyReminders";
import {ReminderForm} from "./ReminderForm";
import './groupreminder.moodule.css'
export function GroupReminder({groupId}:{groupId:number}) {


    return <div className={'h100'} style={{overflowY:'auto'}}>
        <ReminderForm groupId={groupId} />
    <MyReminders groupId={groupId} />
    </div>
}