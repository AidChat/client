import React, {useState} from 'react'
import './index.css'
import {RiSearchLine} from "react-icons/ri";
import {MdGroupAdd} from "react-icons/md";
import {GroupLists} from "../Conversations";
import {DialogPanel} from "../../DialogPanel";

export function ContactPanel() {

    return (<div className={'container'}>
        <div className={'item-container'}>
            <div className={' item searchItem'}><SearchContact/>
                <CreateGroup/>
            </div>
            <div className={'item contactsItem'}><GroupLists/></div>
        </div>
    </div>)
}

function SearchContact() {
    return (<div className={'searchBarContainer'}>
        <div><RiSearchLine color={'green'} size={20}/></div>
        <div>
            <input className={'inputEle'} placeholder={'Search for groups'}/>
        </div>
    </div>)
}

export function CreateGroup() {
    const [showDialog, setDialogVisibility] = useState(false);
    return (
        <div className={'btn btn-primary btn-round'}  style={{margin: '0 8px'}} onClick={() => {
            setDialogVisibility(true)
        }}>
            <MdGroupAdd id={'DialogOpenIcon'} size={24} >
            </MdGroupAdd >
            <DialogPanel open={showDialog} header={'Add Group'} onClose={()=>{setDialogVisibility(false)}} BodyEle={<></>}/>

        </div>
    )
}

