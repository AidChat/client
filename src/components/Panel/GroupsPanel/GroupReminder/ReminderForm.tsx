import {useState} from "react";
import {IReminder} from "../../../../utils/interface";
import {useResponsizeClass} from "../../../../utils/functions";
import {EwindowSizes} from "../../../../utils/enum";
import Tooltip from "../../../Utils/Tooltip";
import {GroupMemberList} from "../Members";
import Snackbar from "../../../Utils/Snackbar";
import { Spinner } from "../../../Utils/Spinner/spinner";
import {days} from "../../../../assets/data";


export function ReminderForm({groupId, reminder}: { groupId: number, reminder?: IReminder }) {
    const [form, setForm] = useState<IReminder>({
        message: undefined,
        notifyBefore: false,
        notifyApp: true,
        notifyWeb: true,
        title: '',
        self: false,
        participants: [],
        recurring:false,
        days:[],
        when:new Date().toString()
    })
    const [message,updateMessage]= useState<string>('')
    const [loading,setLoading] = useState<boolean>(false);
    function handleFormChange(key: string, value: string | undefined | boolean) {
        setForm(function (old) {
            return {
                ...form, [key]: value
            }
        })
    }

    function handleUsersSelection(ids: number[]) {
        setForm(() => {
            return {...form, participants: ids}
        })
    }
    function handleRecursiveDaysSelection(day:string){
        let days = form.days;
        let reminderDays = form.days;
        days = days.filter(item=>item === day);
        if(days.length > 0){
            reminderDays = reminderDays.filter(item=>item !== day);
        }else{
            reminderDays.push(day);
        }
        setForm((prev)=>{
            return {...prev,days:reminderDays}
        })
    }

    async function handleSave(){
        if(!loading)
        updateMessage('Reminder saved')
        setLoading(true);
    }

    console.log(form)
    return (<>
        <Snackbar message={message} onClose={()=>updateMessage('')} />
        <div className={'reminderContainer p8' + useResponsizeClass(EwindowSizes.S, [' flex-column MreminderContainer '])}>
            <div className={'reminder-inputarea h100 w75 ' +useResponsizeClass(EwindowSizes.S, ['w100'])}>
                <div className={'dflex h100 flex-column flex-start'}>
                    <label className={'font-primary font-thick'}>TITLE</label>
                    <input onChange={(e) => handleFormChange('title', e.target.value)} className={'app-input w10'}
                           type={'text'} placeholder={'Enter some title'}/>
                    <label className={'font-primary font-thick'}>MESSAGE</label>
                    <textarea onChange={(e) => handleFormChange('message', e.target.value)}
                              className={'app-input w10 h100'} placeholder={'Write your message.'}/>
                    <label className={'font-primary font-thick'}>When</label>
                    <input onChange={(e)=>{handleFormChange('when',e.target.value)}} className={'font-primary reminderDate'} type={'datetime-local'} />

                </div>

            </div>

            <div
                className={'dflex reminder-inputarea h100 w25 flex-row space-between flex-wrap ' + useResponsizeClass(EwindowSizes.S, [' flex-row w100 space-between '])}>
                <div className={'flex-column  dflex'}>
                    <Tooltip text={"Reminder for self"}><label className={'font-primary font-thick'}>SELF</label>
                    </Tooltip>
                    <div><input checked={form.self} onClick={() => {
                        handleFormChange('self', !form.self)
                    }} className={'app-checkbox-round'} type={'checkbox'}/>
                    </div>
                </div>
                <div className={' dflex flex-row flex-column'}>
                    <div className={'dflex flex-column'}>
                        <Tooltip text={"Reminder on app"}><label
                            className={'font-primary font-thick'}>Notify before</label></Tooltip>
                        <div><input checked={form.notifyBefore}
                                    onClick={() => handleFormChange('notifyBefore', !form.notifyBefore)}
                                    className={'app-checkbox-round'} type={'checkbox'}/>
                        </div>
                    </div>
                </div>
                <div className={' dflex flex-row flex-column w100'}>
                    <div className={'dflex flex-column  w100'}>
                        <Tooltip text={"Reminder on app"}><label
                            className={'font-primary font-thick'}>Recurring</label></Tooltip>
                        <div><input checked={form.recurring}
                                    onClick={() => handleFormChange('recurring', !form.recurring)}
                                    className={'app-checkbox-round'} type={'checkbox'}/>
                        </div>
                        <div>
                            {form.recurring &&
                            <div className={'dflex flex-row space-between w100 flex-wrap'}>
                                {days.map(function(day){
                                return <div onClick={()=>handleRecursiveDaysSelection(day)} className={form.days.filter(item=>item===day).length > 0 ? 'border-light dayToken  ' : ' dayToken' }>{day}</div>
                                })}
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {!form.self && <div className={'reminder-inputarea h100 w100 '}>
                <GroupMemberList groupId={groupId} onSelection={(ids: number[]) => handleUsersSelection(ids)}/>
            </div>
            }
        </div>
        <div>
            <div className={'btn btn-primary w25 ' + useResponsizeClass(EwindowSizes.S, [' w50'])}
                 onClick={handleSave}>{loading ? <Spinner></Spinner> : 'Save'}</div>
        </div>
    </>)
}

