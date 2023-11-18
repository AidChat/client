import React, {useState} from 'react'
import './index.css'
import {RiSearchLine} from "react-icons/ri";
import {MdGroupAdd} from "react-icons/md";
import {GroupList} from "../ConversationList";
import {DialogPanel} from "../../Dialog";
import {GroupForm} from "../GroupForm";
import {Logo} from "../../utility/logo";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;
import {Spinner} from "../../utility/spinner/spinner";

export function ContactPanel() {
    const [loading,_loading] = useState<boolean>(false);
    function handleChange(s:string){
        _loading(true)
    }
    return (<div className={'container'}>
        <div className={'item-container'}>
            <div className={' item searchItem'}>
                <Logo />
                <SearchContact onChange={(e:string)=>{handleChange(e)}}/>
                <CreateGroup/>
            </div>
            {loading ? <Spinner /> :<>
            <div className={'font-primary '} style={{fontWeight:800,display:"flex",alignSelf:'start',padding:'0 6px',marginTop:'8px'}}>My Groups</div>
            <div className={'item contactsItem'}><GroupList/></div>
            </>
            }
        </div>
    </div>)
}

function SearchContact({onChange}:{onChange:(e:string)=>void}) {
    return (<div className={'searchBarContainer shadow-box'}>
        <div><RiSearchLine color={'#398378'} size={20}/></div>
        <div>
            <input className={'inputEle'} onChange={(e)=>{onChange(e.target.value)}} placeholder={'Search for groups'}/>
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
