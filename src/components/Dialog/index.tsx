import React, {ReactElement} from 'react';
import {IoMdClose} from "react-icons/io";
import './index.css'

interface DialogPanelProps {
    open: boolean,
    header: string,
    BodyEle: ReactElement
    onClose : (B:boolean)=> void
}

export function DialogPanel(props: DialogPanelProps) {
    return (
        <div className={'dialogContainer'}>
        <dialog className={'dialog'} open={props.open}>
           <div className={'dialogWrapper'}>
            <div className={'dialogHeader'}>
                <div className={'dialogHeaderText'}>
                    {props.header}
                </div>
                <div onClick={()=>{
                    props.onClose(false);
                }}>
                    <IoMdClose color={'#398378'} size={18} />
                </div>
            </div>
            <div className={'dialogBody'}>{props.BodyEle}</div>
           </div>
        </dialog>
        </div>
    )
}