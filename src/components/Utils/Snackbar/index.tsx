import React, {useEffect, useState} from 'react';
import './index.css';
import {AiFillCloseCircle} from 'react-icons/ai';
import {motion} from "framer-motion";

interface SnackbarProps {
    message: string;
    onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({message, onClose}) => {
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        if (message) {
            setShow(true);
            const timeout = setTimeout(() => {
                setShow(false);
                onClose();
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [message, onClose]);

    return show && message.split('').length > 0 ? (
        <motion.div initial={{y: '10px'}} animate={{y: '0px'}} className="snackbar">
            <div style={{flex: 2,fontStyle:'italic'}}>{message}</div>
            <div style={{display: 'flex', marginLeft: '10px'}} className={'pointer'} onClick={onClose}>
                <AiFillCloseCircle/>
            </div>
        </motion.div>
    ) : null;
};

export default Snackbar;
