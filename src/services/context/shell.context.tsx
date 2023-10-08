import React, {ReactElement, useState} from 'react';


interface ShellInterface {
    snackbarProps: {
        show: boolean,
        message: string
    },
    setShowSnackbarProps?: (V: boolean) => void,
    showSnackbar?: (M: string) => void,
    _setGroupId : (Id:string) => void,
    groupId: string | null,
    _setUserId : (Id:string) => void,
    userId : string | null
}

export const ShellContext = React.createContext<any>({snackbarProps: {show: false, message: ''}});


export function ShellContextProvider({children}: { children: ReactElement }) {
    const [snackbarProps, setShowSnackbarProps] = useState({show: false, message: ''});
    const [groupId , _setGroupId] = useState<null | string>(null);
    const [userId,_setUserId] = useState<string | null>(null)
    function showSnackbar(msg: string) {
        setShowSnackbarProps({show: true, message: msg})
        setTimeout(() => {
            setShowSnackbarProps({show: false, message: ''})
        }, 5000)
    }
    return (
        <ShellContext.Provider value={{snackbarProps, showSnackbar,_setGroupId,groupId,_setUserId,userId}}>
            {children}
        </ShellContext.Provider>
    )
}