import React, {useState} from 'react';
import './index.css'
import {BsPeople} from "react-icons/bs";
import {AiFillSetting, AiOutlineUsergroupAdd} from "react-icons/ai";
import {BiArrowBack} from "react-icons/bi";
import {Requests} from "../Requests";
import {Members} from "../Members";
import {Settings} from "../Settings";







interface _int {
    groupId: string
    showChat: () => void
}

export function GroupOptions(props: _int) {
    const [activeMenuItem, setActiveMenuItem] = useState('members');

    const handleMenuItemClick = (menuItem: React.SetStateAction<string>) => {
        setActiveMenuItem(menuItem);
    };

    return (
        <div>
            <div style={{
                height: '5rem',
                background: 'black',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div className={'options-wrapper'}
                     style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <div style={{cursor: "pointer", marginRight: '20px'}}
                         onClick={() => props.showChat()}><BiArrowBack size={22} color={'white'}/></div>

                    <div style={{flex: '1'}} className={activeMenuItem === 'members' ? 'item-option-active ' : ''}
                         onClick={() => handleMenuItemClick('members')}><BsPeople size={22} color={'white'}/></div>
                    <div style={{flex: '1'}} className={activeMenuItem === 'requests' ? 'item-option-active ' : ''}
                         onClick={() => handleMenuItemClick('requests')}><AiOutlineUsergroupAdd size={22}
                                                                                                color={'white'}/>
                    </div>
                    <div style={{flex: '1'}} className={activeMenuItem === 'settings' ? 'item-option-active ' : ''}
                         onClick={() => handleMenuItemClick('settings')}><AiFillSetting size={22} color={'white'}/>
                    </div>
                </div>
            </div>
            <div>
                {activeMenuItem === 'members' && <Members groupId={props.groupId}/>}
                {activeMenuItem === 'requests' && <Requests groupId={props.groupId}/>}
                {activeMenuItem === 'settings' && <Settings groupId={props.groupId}/>}
            </div>
        </div>
    );
}
