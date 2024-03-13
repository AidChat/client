import React, {ReactElement} from 'react';
import {IoMdClose} from "react-icons/io";
import './index.css'
import {useResponsizeClass} from "../../utils/functions";
import {EwindowSizes} from "../../utils/enum";
import {AnimatePresence, motion} from 'framer-motion';

interface DialogPanelProps {
    open: boolean,
    header: string,
    BodyEle: ReactElement,
    onClose: (B: boolean) => void,
    load?: boolean
}

export function DialogPanel(props: DialogPanelProps) {
    return (<AnimatePresence>
            <motion.dialog  initial={{ x: "-100px", opacity: 0 }}
                            animate={{ x: "0px", opacity: 1 }}
                            exit={{ x: "-100px", opacity: 0 }}
                           className={'dialog-ele' + useResponsizeClass(EwindowSizes.S, [' w100  br-none '])}
                           open={props.open}>
                <div className={'dialogWrapper'}>
                    <div className={'dialogHeader'}>
                        <div className={'dialogHeaderText'}>
                            {props.header}
                        </div>
                        <IoMdClose style={{cursor: 'pointer'}} onClick={() => {
                            props.onClose(false);
                        }} color={'green'} size={20}/>

                    </div>
                    <div className={'dialogBody'}>{props.BodyEle}</div>
                </div>
            </motion.dialog>
        </AnimatePresence>)
}