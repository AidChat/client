import React, {ReactElement, useState} from 'react';
import {IoMdClose} from "react-icons/io";
import './index.css'
import {Spinner} from "../utility/spinner/spinner";

interface DialogPanelProps {
    open: boolean,
    header: string,
    BodyEle: ReactElement,
    onClose : (B:boolean)=> void,
    load ?:boolean
}

export function DialogPanel(props: DialogPanelProps) {
    const [loading,setLoading] = useState<boolean>(props.load ? props.load : false);


    return (
        <>
            {loading && <Spinner />}
        <div className={'dialogContainer'}>
        <dialog className={'dialog'} open={props.open}>
           <div className={'dialogWrapper'}>
            <div className={'dialogHeader'}>
                <div className={'dialogHeaderText'}>
                    {props.header}
                </div>
                <div style={{cursor:'pointer'}} onClick={()=>{
                    props.onClose(false);
                }}>
                    <IoMdClose color={'#398378'} size={18} />
                </div>
            </div>
            <div className={'dialogBody'}>{props.BodyEle}</div>
           </div>
        </dialog>
        </div>
        </>
    )
}