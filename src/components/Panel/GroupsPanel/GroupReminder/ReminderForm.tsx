import {useState} from "react";
import {IReminder} from "../../../../utils/interface";
import {useResponsizeClass} from "../../../../utils/functions";
import {EwindowSizes, reqType, service, serviceRoute} from "../../../../utils/enum";
import Tooltip from "../../../Utils/Tooltip";
import {GroupMemberList} from "../Members";
import Snackbar from "../../../Utils/Snackbar";
import {Spinner} from "../../../Utils/Spinner/spinner";
import {days} from "../../../../assets/data";
import {_props} from "../../../../services/network/network";


export function ReminderForm({groupId, reminder,refetch}: { groupId: number, reminder?: IReminder,refetch:()=>void }) {
    const [reminderForm, setReminderForm] = useState<any>({
        message: undefined,
        notifyBefore: false,
        notifyApp: true,
        notifyWeb: true,
        title: '',
        self: false,
        participants: [],
        recurring:false,
        recurringDays:[],
        when:new Date().toString()
    })
    const [message,updateMessage]= useState<string>('')
    const [loading,setLoading] = useState<boolean>(false);
    function handleFormChange(key: string, value: string | undefined | boolean) {
        setReminderForm(function () {
            return {
                ...reminderForm, [key]: value
            }
        })
    }

    function handleUsersSelection(ids: number[]) {
        setReminderForm(() => {
            return {...reminderForm, participants: ids}
        })
    }
    function handleRecursiveDaysSelection(day:string){
        let days:string[] = reminderForm.recurringDays;
        let reminderDays : string[] = reminderForm.recurringDays;
        days = days.filter((item:string)=>item === day);
        if(days.length > 0){
            reminderDays = reminderDays.filter(item=>item !== day);
        }else{
            reminderDays.push(day);
        }
        setReminderForm((prev: any)=>{
            return {...prev,days:reminderDays}
        })
    }

    async function handleSave() {
       try {
           if (!loading) {
               setLoading(true);
               const response = await _props._db(service.group).query(serviceRoute.groupReminders, reminderForm, reqType.post, groupId)
               updateMessage(response.message);
               setLoading(false);
               refetch();

           }
       }catch (e) {
           setLoading(false);
           updateMessage("Failed to create reminder please try again later.")
       }
    }


    return (<div style={{position:'sticky',top:0}}>
        <Snackbar message={message} onClose={() => updateMessage('')}/>
        <div
            className={'reminderContainer p8' + useResponsizeClass(EwindowSizes.S, [' flex-column MreminderContainer '])}>
            <div className={'reminder-inputarea h100 w75 ' + useResponsizeClass(EwindowSizes.S, ['w100'])}>
                <div className={'dflex h100 flex-column flex-start'}>
                    <label className={'font-primary font-thick'}>TITLE</label>
                    <input onChange={(e) => handleFormChange('title', e.target.value)} className={'app-input w10 h100'}
                           type={'text'} placeholder={'Enter some title'}/>
                    <label className={'font-primary font-thick'}>MESSAGE</label>
                    <textarea onChange={(e) => handleFormChange('message', e.target.value)}
                              className={'app-input w10 h100'} placeholder={'Write your message.'}/>
                    <label className={'font-primary font-thick'}>When</label>
                    <input onChange={(e) => {
                        handleFormChange('when', e.target.value)
                    }} className={'font-primary  h100 reminderDate'} type={'datetime-local'}/>
                </div>

            </div>

            <div
                className={'dflex reminder-inputarea h100 w25 flex-row space-between flex-wrap ' + useResponsizeClass(EwindowSizes.S, [' flex-row w100 space-between '])}>

                <div className={' dflex flex-row flex-column'}>
                    <div className={'dflex flex-column'}>
                        <Tooltip text={"Reminder on app"}><label
                            className={'font-primary font-thick'}>Notify before</label></Tooltip>
                        <div><input checked={reminderForm.notifyBefore}
                                    onClick={() => handleFormChange('notifyBefore', !reminderForm.notifyBefore)}
                                    className={'app-checkbox-round'} type={'checkbox'}/>
                        </div>
                    </div>
                </div>
                <div className={' dflex flex-row flex-column w100'}>
                    <div className={'dflex flex-column  w100'}>
                        <Tooltip text={"Reminder on app"}><label
                            className={'font-primary font-thick'}>Recurring</label></Tooltip>
                        <div><input checked={reminderForm.recurring}
                                    onClick={() => handleFormChange('recurring', !reminderForm.recurring)}
                                    className={'app-checkbox-round'} type={'checkbox'}/>
                        </div>
                        <div>
                            {reminderForm.recurring &&
                                <div className={'dflex flex-row space-between w100 flex-wrap'}>
                                    {days.map(function (day) {
                                        return <div onClick={() => handleRecursiveDaysSelection(day)}
                                                    className={reminderForm.recurringDays.filter((item: string) => item === day).length > 0 ? 'border-light dayToken  ' : ' dayToken'}>{day}</div>
                                    })}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {!reminderForm.self && <div className={'reminder-inputarea h100 w100 '}>
                <GroupMemberList selectable={true} groupId={groupId}
                                 onSelection={(ids: number[]) => handleUsersSelection(ids)}/>
            </div>
            }

        </div>
        <div>
            <div className={'btn btn-primary w25 ' + useResponsizeClass(EwindowSizes.S, [' w50'])}
                 onClick={handleSave}>{loading ? <Spinner></Spinner> : 'Save'}</div>
        </div>
    </div>)
}

