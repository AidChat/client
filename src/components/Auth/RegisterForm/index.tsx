import React, {ChangeEvent, FormEvent, FormEventHandler, FormHTMLAttributes, useEffect, useState} from 'react';
import {_props} from "../../../services/network/network";
import {useParams} from "react-router-dom";
import {FaFacebook, FaGoogle} from "react-icons/fa6";
import {Spinner} from "../../Utils/Spinner/spinner";
import {reqType, service, serviceRoute} from "../../../utils/enum";
import {motion} from 'framer-motion';


interface RegisterFormProps {
    toggleState: () => void,
    email?: string,
}

export function RegisterForm({toggleState, email}: RegisterFormProps) {
    const {requestCode} = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [state, setState] = useState<{
        name?: string, email?: string, password?: string, requestId?: undefined | string
    }>({
        name: undefined, email: email, password: undefined, requestId: requestCode
    });
    let [error, _seterror] = useState(null);

    function handleRegistration(e: FormEvent) {
        e.preventDefault();
        setLoading(!loading);
        _props._db(service.authentication).query(serviceRoute.register, state, reqType.post).then(result => {
            toggleState();
            setLoading(!loading);

        })
            .catch((reason) => {
                _seterror(reason.response.data.data.message);
                setLoading(!loading);

            })
    }

    function handleUpdate(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        let {name, value} = event.target;
        setState({
            ...state, [name]: value
        })
    }

    useEffect(() => {
        window.setTimeout(() => {
            _seterror(null)
        }, 3000)
    }, [error]);


    return (<motion.div animate={{x:0}}  transition={{type:"tween"}} initial={{x:-50}} exit={{x:100}} className={'loginFormWrapper'}>
            <form style={{width: '80%'}} onSubmit={handleRegistration}>
                <div className={'logincontainer center font-primary'}>{error}</div>
                <div className={'logincontainer'}>
                    <label style={{marginLeft: '4px'}}>Name</label>
                    <div className={'inputWrapper-icon'}>
                        <input type={'name'} value={state.name} name={'name'} onChange={handleUpdate}
                               className={'inputEle'}/>
                    </div>
                </div>
                <div className={'logincontainer'}>
                    <label style={{marginLeft: '4px'}}>Email</label>
                    <div className={'inputWrapper-icon'}>
                        <input type={'email'} name={'email'} value={state.email} disabled={email ? true : false}
                               onChange={handleUpdate} className={'inputEle'}/>
                    </div>
                </div>
                <div className={'logincontainer'}>
                    <label>Password</label>
                    <div className={'inputWrapper-icon'}>
                        <input type={'password'} name={'password'} onChange={handleUpdate} className={'inputEle'}/>
                    </div>
                </div>
                <div className={'logincontainer flex-center'}>
                    <button onClick={handleRegistration} className={'btn btn-primary w50'}>
                        {loading ? <Spinner/> : 'Register'}
                    </button>
                </div>
                <div className={'logincontainer flex-right'} style={{marginTop: '24px'}}>
                    <div className={'font-primary'} onClick={() => {
                        toggleState()
                    }}>
                        <p>Already part of our community? <span className={'color-green'}
                                                                style={{cursor: 'pointer'}}> Login </span></p>
                    </div>
                </div>
            </form>

        </motion.div>

    )
}