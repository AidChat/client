import React, {useEffect, useState} from 'react';
import './index.css'
import {AiFillCloseCircle} from "react-icons/ai";

export function Snackbar({message}: { message: string }) {
    const [show, _show] = useState<boolean>(false)

    useEffect(() => {
        if (message) {
            _show(true);
        }else{
            _show(false);
        }
    }, [message]);

    return (show ? <div className={'snackbar'}>
        <div style={{flex: 2}}>{message}</div>
        <div style={{display: "flex", marginLeft: '10px'}} onClick={() => _show(false)}><AiFillCloseCircle/></div>
    </div> : <></>)
}