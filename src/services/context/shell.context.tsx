import React, {ReactElement, useState} from 'react';
import {Snackbar} from "../../components/snackbar";


interface ShellInterface {
    snackbarProps: {
        show: boolean,
        message: string
    },
    setShowSnackbarProps?: (V: boolean) => void,
    showSnackbar?: (M: string) => void
}

export const ShellContext = React.createContext<any>({snackbarProps: {show: false, message: ''}});


export function ShellContextProvider({children}: { children: ReactElement[] }) {
    const [snackbarProps, setShowSnackbarProps] = useState({show: false, message: ''});

    function showSnackbar(msg: string) {
        setShowSnackbarProps({show: true, message: msg})
        setTimeout(() => {
            setShowSnackbarProps({show: false, message: ''})
        }, 5000)
    }

    return (
        <ShellContext.Provider value={{snackbarProps, showSnackbar}}>
            {children}
            {snackbarProps.show && <Snackbar click={() => {
                setShowSnackbarProps({message: '', show: false})
            }}/>}
        </ShellContext.Provider>
    )
}