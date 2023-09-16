import React, {ReactElement} from 'react';
import {IoMdClose} from "react-icons/io";
import './index.css'

interface DialogPanelProps {
    open: boolean,
    header: string,
    BodyEle: ReactElement
    onClose : ()=> void
}

export function DialogPanel({open, header, BodyEle,onClose}: DialogPanelProps) {

    return (
        <dialog className={'dialog'} open={open}>
           <div className={'dialogWrapper'}>
            <div className={'dialogHeader'}>
                <div className={'dialogHeaderText'}>
                    {header}
                </div>
                <div>
                    <IoMdClose color={'green'} size={18} onClick={()=>{onClose()}}/>
                </div>
            </div>
            <div className={'dialogBody'}>{BodyEle}</div>
           </div>
        </dialog>
    )
}