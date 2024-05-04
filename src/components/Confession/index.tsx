import React from "react";
import {Input} from "../Utils/CustomInput";
import './index.css'
import {RiSpeakFill} from "react-icons/ri";

interface Props {
    click: () => void
}

export const Confession = (props: Props) => {
    return <>
        <div className="confession">
            <div className={'confession_container'}>
                <Input height={"4em"} borderRadius={'20px'} textColor={'whitesmoke'} placeholder={"Confess here"}
                       allowToggle={false} disabled={false} icon={<RiSpeakFill color={'green'} size={28}/>}
                       type={'text'} onChange={() => {
                }} inputName={"confession"}/>
            </div>
            <div className={'btncontainer pointer'}>
                <div className={'font-primary'}>
                    Or
                </div>
                <div className={'loginbtn font-primary font-thick'} onClick={() => props.click()}>
                    Login
                </div>
            </div>
        </div>
    </>;
}

