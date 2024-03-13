import React, {useState} from 'react';
import './index.css'
import {BsAlarm, BsPeople} from "react-icons/bs";
import {AiFillSetting, AiOutlineUsergroupAdd} from "react-icons/ai";
import {BiArrowBack} from "react-icons/bi";
import {Requests} from "../Requests";
import {GroupMemberList} from "../Members";
import {Settings} from "../Settings";
import {groupOptions} from "../../../../utils/menu";
import {GroupReminder} from "../GroupReminder";


interface _int {
    groupId: string
    showChat: () => void
    role: string | undefined
    init?: string
}

export function GroupOptions(props: _int) {
    const [activeMenuItem, setActiveMenuItem] = useState(props.init ? props.init : 'members');

    const handleMenuItemClick = (menuItem: React.SetStateAction<string>) => {
        setActiveMenuItem(menuItem);
    };

    function handleOptionsIcon(icon: string) {
        switch (icon) {
            case 'BsPeople' :
                return <BsPeople size={20} color={'whitesmoke'}/>
                break;
            case 'AiOutlineUsergroupAdd':
                return <AiOutlineUsergroupAdd size={20} color={'whitesmoke'}/>
                break;
            case 'BsAlarm':
                return <BsAlarm size={20} color={'whitesmoke'}/>
                break;
            case 'AiFillSetting':
                return <AiFillSetting size={20} color={'whitesmoke'}/>
                break;
            default:
                break;

        }
    }

    return (<>
        <div className={'options-panel-wrapper'}>
            <div className={'options-wrapper'}
                 style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                <div style={{
                    cursor: "pointer",
                    marginRight: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                     onClick={() => props.showChat()}><BiArrowBack size={22} color={'white'}/></div>
                {groupOptions.map(function (item) {
                    return (<>
                        {(!item.role.length || item.role.filter(item=> item === props.role).length > 0) &&  <div style={{flex: '1', margin: '0 18px'}}
                             className={activeMenuItem === item.label ? 'item-option-active ' : ''}
                             onClick={() => handleMenuItemClick(item.label)}>{handleOptionsIcon(item.icon)}
                        </div>
                        }
                    </>)
                })}
            </div>
        </div>
        {activeMenuItem === 'members' && <GroupMemberList groupId={props.groupId}/>}
        {activeMenuItem === 'invites' && <Requests groupId={props.groupId}/>}
        {activeMenuItem === 'reminders' && <GroupReminder groupId={props.groupId}/>}
        {activeMenuItem === 'setting' && <Settings groupId={props.groupId}/>}

    </>);
}

