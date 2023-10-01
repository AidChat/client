import React, {useState} from 'react'
import './index.css'
import {RiSearchLine} from "react-icons/ri";
import {MdGroupAdd} from "react-icons/md";
import {GroupLists} from "../Conversations";
import {DialogPanel} from "../../DialogPanel";
import {GroupForm} from "../GroupForm";
import {Logo} from "../../utility/logo";

export function ContactPanel() {

    return (<div className={'container'}>
        <div className={'item-container'}>
            <div className={' item searchItem'}>
                <Logo />
                <SearchContact/>
                <CreateGroup/>
            </div>
            <div className={'item contactsItem'}><GroupLists/></div>
        </div>
    </div>)
}

function SearchContact() {
    return (<div className={'searchBarContainer'}>
        <div><RiSearchLine color={'#398378'} size={20}/></div>
        <div>
            <input className={'inputEle'} placeholder={'Search for groups'}/>
        </div>
    </div>)
}

export function CreateGroup() {
    const [showDialog, setDialogVisibility] = useState<boolean>(false);
    return (
        <div  className={'addGroupBtn'} style={{margin: '0 8px'}} onClick={() => {
            setDialogVisibility(!showDialog);
        }}>
            <MdGroupAdd id={'DialogOpenIcon'} color={''} size={24}>
            </MdGroupAdd>
            <DialogPanel open={showDialog} header={'Add Group'} onClose={(B) => {
                setDialogVisibility(B);
            }} BodyEle={<GroupForm/>}/>
        </div>
    )
}

