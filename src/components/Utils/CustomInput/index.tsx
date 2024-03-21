import {ChangeEvent, ReactElement, useState} from "react";


interface ICustomInput {
    onChange: (s: ChangeEvent<HTMLInputElement>) => void,
    icon?: ReactElement,
    type: string
    allowToggle: boolean,
    inputName:string,
    value?:string | number | undefined,
    disabled?:boolean
}

export const styles = {
    container: {
        height: '2em', background: 'transparent',display:'flex',
        justifyContent:'space-between'
    }, iconContainer: {
        width: '20%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        cursor:'pointer'
    }, inputContainer: {
        width: '90%',
        height:'100%'
    }, inputEle: {
        width: '100%', background: 'transparent', border: 'none',
        height:'100%',
        paddingLeft:'20px'
    }

}


export function Input(props: ICustomInput) {
    const [state, setState] = useState({isHidden: true})
    function toggleState() {
        if (props.allowToggle && props.type === 'password') {
            setState({...state, isHidden: !state.isHidden})
        }
    }
    return (<div style={styles.container}>
        <div style={styles.inputContainer}>
            <input disabled={props.disabled} value={props.value} name={props.inputName} onChange={props.onChange} style={styles.inputEle} type={state.isHidden ? props.type : 'text'}/>
        </div>
        <div style={styles.iconContainer} onClick={toggleState}>{props.icon}</div>
    </div>)
}

