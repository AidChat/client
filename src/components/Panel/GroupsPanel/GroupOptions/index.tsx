import React, {useState} from 'react';
import './index.css'
import {BsPeople} from "react-icons/bs";
import {AiFillSetting, AiOutlineUsergroupAdd} from "react-icons/ai";
import {Spinner} from "../../../utility/spinner/spinner";
import {HiOutlineChatBubbleOvalLeftEllipsis} from "react-icons/hi2";
import {BiArrowBack} from "react-icons/bi";

function Members() {
    const [data, setData] = useState(null);
    return (
        <div className={'members-container'}>
            {
                data ?
                    <div className={'font-primary'}>Members</div>
                    : <Spinner/>
            }
        </div>
    )
}

function Requests() {
    const [data, setData] = useState(null);
    return (
        <div className={'members-container'}>
            {
                data ?
                    <div className={'font-primary'}>Members</div>
                    : <Spinner/>
            }
        </div>
    )
}

function Settings() {
    const [data, setData] = useState(null);
    return (
        <div className={'members-container'}>
            {
                data ?
                    <div className={'font-primary'}>Members</div>
                    : <Spinner/>
            }
        </div>
    )
}

interface _int {
    groupId: string
    showChat : ()=> void
}

export function GroupOptions(props: _int) {
    const [activeMenuItem, setActiveMenuItem] = useState('members');

    const handleMenuItemClick = (menuItem: React.SetStateAction<string>) => {
        setActiveMenuItem(menuItem);
    };

    return (
        <div style={{padding: '25px 30px'}}>
            <div className={'options-wrapper'} style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{cursor:"pointer",marginRight:'20px'}}
                     onClick={() => props.showChat()}><BiArrowBack size={22} color={'white'}/></div>

                <div style={{flex:'1'}} className={ activeMenuItem === 'members' ? 'item-option-active ' : ''}
                     onClick={() => handleMenuItemClick('members')}><BsPeople size={22} color={'white'}/></div>
                <div style={{flex:'1'}} className={activeMenuItem === 'requests' ? 'item-option-active ' : ''}
                     onClick={() => handleMenuItemClick('requests')}><AiOutlineUsergroupAdd size={22} color={'white'}/>
                </div>
                <div style={{flex:'1'}} className={activeMenuItem === 'settings' ? 'item-option-active ' : ''}
                     onClick={() => handleMenuItemClick('settings')}><AiFillSetting size={22} color={'white'}/></div>
            </div>

            <div>
                {activeMenuItem === 'members' && <Members/>}
                {activeMenuItem === 'requests' && <Requests/>}
                {activeMenuItem === 'settings' && <Settings/>}
            </div>
        </div>
    );
}

