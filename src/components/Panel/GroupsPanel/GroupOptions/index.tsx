import React, {useState} from 'react';
import './index.css'
import {BsPeople} from "react-icons/bs";
import {AiFillSetting, AiOutlineUsergroupAdd} from "react-icons/ai";
import {BiArrowBack} from "react-icons/bi";
import {Requests} from "../Requests";
import {GroupMemberList} from "../Members";
import {Settings} from "../Settings";


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

                    <div style={{flex: '1', margin: '0 18px'}}
                         className={activeMenuItem === 'members' ? 'item-option-active ' : ''}
                         onClick={() => handleMenuItemClick('members')}><BsPeople size={22} color={'white'}/></div>
                    {(props.role == 'OWNER' || props.role == 'ADMIN') && <div style={{flex: '1', margin: '0 18px'}}
                                                                              className={activeMenuItem === 'requests' ? 'item-option-active ' : ''}
                                                                              onClick={() => handleMenuItemClick('requests')}>
                        <AiOutlineUsergroupAdd size={22} color={'white'}/>
                    </div>}
                    <div style={{flex: '1', margin: '0 18px'}}
                         className={activeMenuItem === 'settings' ? 'item-option-active ' : ''}
                         onClick={() => handleMenuItemClick('settings')}><AiFillSetting size={22} color={'white'}/>
                    </div>
                </div>
            </div>
            {activeMenuItem === 'members' && <GroupMemberList groupId={props.groupId}/>}
            {activeMenuItem === 'requests' && <Requests groupId={props.groupId}/>}
            {activeMenuItem === 'settings' && <Settings groupId={props.groupId}/>}

        </>);
}

