import {useEffect, useRef, useState} from "react";
import {_props} from "../../../services/network/network";
import {reqType, service, serviceRoute} from "../../../utils/enum";
import Snackbar from "../../Utils/Snackbar";


interface ICode {
    email: string,
    toggleState: (s:"LOGIN" | "REGISTER" | "CODE") => void
}

enum specialKeyEvents {
    backspace = 'Backspace', enter = 'Enter'
}

export function OTPForm(props: ICode) {
    const [state, setState] = useState<Array<{ [key: number]: number | undefined }>>([{}]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentFocus, setCurrentFocus] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('')
    /**
     * Calculate the initial setup for this component
     */
    useEffect(() => {
            setState([]);
            /*
            default input elements are 4
             */
            let length: number = 4;
            for (let i: number = 0; i < length; i++) {
                setState((prev: Array<{ [key: number]: number | undefined }>) => {
                    return [...prev, {[i]: undefined}]
                })
            }
            return () => {
                setState([]);
            }
        },

        []);

    /**
     * Checks for keyup event and react to it
     * @param key
     * @param event
     */
    const handleInput = (key: number, event: KeyboardEvent) => {
        const base: number = 0;
        const limit: number = state.length;
        const _keytype: string = event.code;
        if (_keytype === specialKeyEvents.backspace) {
            if (key > base) {
                let nextId = key - 1;
                setCurrentFocus(nextId);
            }
        } else {
            if (currentFocus < limit) {
                setCurrentFocus(key + 1);
                let s = state;
                s[key] = {[key]: parseInt(event.key)};
                setState(s);
            }
            if (_keytype !== specialKeyEvents.enter) if (key + 1 === limit) {
                verifyCode()
            }
        }


    }
    /**
     * on every mutation of currentFocus, this will execute
     */
    useEffect(() => {
        inputRef?.current?.focus()
    }, [currentFocus]);

    function verifyCode() {
        let code: any = state.map(function (item, index) {
            return item[index]
        });
        code = code.join('');
        setLoading(true);

        _props._db(service.authentication).query(serviceRoute.verifyCode, {
            code: code, email: props.email
        }, reqType.post, undefined)
            .then(function (response) {
                setLoading(false);
                props.toggleState("LOGIN");
            })
            .catch(function (response) {
                setLoading(false);
                setError(response.data.message);
            })

    }

    function generateCode() {
        if (!loading) setLoading(true)
        _props._db(service.authentication).query(serviceRoute.generateCode, {email: props.email}, reqType.put, undefined)
            .then(function (response) {
                setLoading(false);
                setMessage(response?.message);

            })
            .catch(function (response) {
                setLoading(false);
                setError(response.message)
            })

    }

    useEffect(() => {
        window.setTimeout(function () {
            if (error !== '') {
                setError('');
            }
        }, 5000);
    }, [error]);

    return (<div className={'dflex flex-column h100 '} style={{justifyContent: 'center', alignItems: 'center'}}>
        <Snackbar message={message} onClose={() => setMessage('')}/>
        <div className={'input-wrapper dflex flex-column'}>
            <div style={{height: '70px'}}><h6 className={'font-secondary'}>{error}</h6></div>
            <div className={'dflex flex-row'}>
                {state.map((element: any, index: number) => <div key={index} className={'code-input-element'}>
                    <input disabled={loading} onKeyUp={(event: any) => {
                        handleInput(state.indexOf(element), event)
                    }} ref={state.indexOf(element) === currentFocus ? inputRef : undefined}
                           maxLength={1}
                           className={'input-ele'}
                           id={state.indexOf(element).toString()} type={"tel"}/>
                </div>)}
            </div>
            <h2 className={'font-primary'}>Enter the opt sent to you email</h2>
            <h2 style={{alignSelf: 'end'}} className={'font-secondary pointer'} onClick={generateCode}>Resend</h2>
            <h2 style={{alignSelf: 'end'}} className={'font-secondary pointer'} onClick={()=>{props.toggleState("LOGIN")}}>Login</h2>
        </div>

    </div>)
}