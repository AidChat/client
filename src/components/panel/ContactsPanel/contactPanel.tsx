import React from 'react'
import './index.css'
import {RiSearchLine} from "react-icons/ri";

export function ContactPanel() {

    return (<div className={'container'}>
        <div className={'item-container'}>
            <div className={' item searchItem'}><SearchContact/></div>
            <div className={'item contactsItem'}><ContactList/></div>
        </div>
    </div>)
}

function SearchContact() {
    return (<div className={'searchBarContainer shadow'}>
        <div><RiSearchLine color={'green'} size={22}/></div>
        <div>
            <input className={'inputEle'} placeholder={'Search for contact'}/>
        </div>
    </div>)
}

function ContactList() {
    return (<div>list</div>)
}