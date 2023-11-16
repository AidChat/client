import React, {useState} from 'react'
import './index.css'
import {RiSearchLine} from "react-icons/ri";
import {MdGroupAdd} from "react-icons/md";
import {GroupList} from "../ConversationList";
import {DialogPanel} from "../../Dialog";
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
            <div className={'item contactsItem'}><GroupList/></div>
        </div>
    </div>)
}

function SearchContact() {
    return (<div className={'searchBarContainer shadow-box'}>
        <div><RiSearchLine color={'#398378'} size={20}/></div>
        <div>
            <input className={'inputEle'} placeholder={'Search for groups'}/>
        </div>
    </div>)
}


function CreateGroup() {
    const [showDialog, setDialogVisibility] = useState(false);

    const handleDialogOpen = () => {
        setDialogVisibility(true);
    };

    const handleDialogClose = () => {
        setDialogVisibility(false);
    };

    return (
        <div className="addGroupBtn">
            <MdGroupAdd id="DialogOpenIcon" size={24} onClick={handleDialogOpen} />
                <DialogPanel
                    open={showDialog}
                    header="Add Group"
                    onClose={handleDialogClose}
                    BodyEle={<GroupForm onSubmit={()=>{handleDialogClose()}}  />}
                />
        </div>
    );
}
