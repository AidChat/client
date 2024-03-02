import React, { useEffect, useState } from 'react';
import './index.css';
import { AiFillCloseCircle } from 'react-icons/ai';

interface SnackbarProps {
    message: string;
    onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, onClose }) => {
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        if (message) {
            setShow(true);
            const timeout = setTimeout(() => {
                setShow(false);
                onClose();
            }, 3000); // Adjust the timeout duration as needed
            return () => clearTimeout(timeout);
        }
    }, [message, onClose]);

    return show ? (
        <div className="snackbar">
            <div style={{ flex: 2 }}>{message}</div>
            <div style={{ display: 'flex', marginLeft: '10px' }} onClick={onClose}>
                <AiFillCloseCircle />
            </div>
        </div>
    ) : null;
};

export default Snackbar;
