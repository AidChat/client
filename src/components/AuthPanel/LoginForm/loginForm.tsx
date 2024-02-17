import React, {ChangeEvent, FormEvent, useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../../services/context/auth.context";
import {_props, reqType, service, serviceRoute} from "../../../services/network/network";
import {Spinner} from "../../utility/Spinner/spinner";
import {useParams} from "react-router-dom";

interface LoginFromProps {
    toggleState: () => void,
    email?: string
}

export function LoginForm({toggleState, email}: LoginFromProps) {
    let context = useContext(AuthContext);
    const {requestCode} = useParams()
    const [userdata, setUserData] = useState<{
        email: any,
        password: any,
        extend: boolean,
        requestId: string | undefined
    }>({
        email: email,
        password: undefined,
        extend: false,
        requestId: requestCode
    })
    const [error, setError] = useState(null);
    const [loading, _loading] = useState(false);
    useEffect(() => {
        window.setTimeout(() => {
            setError(null)
        }, 3000)
    }, [error]);

    function handleUpdate(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    }

    function handleLogin(event: FormEvent) {
        event.preventDefault()
        _loading(true)
        _props._db(service.authentication).query(serviceRoute.login, userdata, reqType.post).then(
            response => {
                context?.verifyAuthentication(response.data.session.session_id, requestCode ? true : false)
                _loading(false);
            }
        )
            .catch((reason) => {
                setError(reason?.response.data.data.message)
                _loading(false);

            })
    }


    return (
        <div className={'loginFormWrapper'}>
            <form style={{width: '80%'}} onSubmit={handleLogin}>
                <div className={'logincontainer color-green'} style={{textAlign: 'center'}}>{error}</div>
                <div className={'logincontainer'}>
                    <label style={{marginLeft: '4px'}}>Email</label>
                    <div className={'inputWrapper-icon'}>
                        <input type={'email'} name={'email'} onChange={handleUpdate} required={true}
                               className={'inputEle'}/>
                    </div>
                </div>
                <div className={'logincontainer'}>
                    <label>Password</label>
                    <div className={'inputWrapper-icon'}>
                        <input type={'password'} className={'inputEle'} required={true} name={'password'}
                               onChange={handleUpdate}/>
                    </div>
                </div>
                <div style={{marginTop: 10, display: 'flex', alignContent: "center", alignItems: 'center'}}>
                    <input type={'checkbox'} style={{height: 20, width: 20}} name={'extend'} checked={userdata.extend}
                           onClick={() => setUserData({...userdata, extend: !userdata.extend})}/>
                    <div>
                        <label className={'font-primary'} onClick={() => {
                            setUserData({...userdata, extend: !userdata.extend})
                        }}>Remember me</label>
                    </div>
                </div>
                <div className={'logincontainer flex-center'}>
                    <button onClick={handleLogin} className={'btn btn-primary w50'} style={{position:'relative'}}>
                        {loading ? <Spinner/> : 'Login'}
                    </button>
                </div>
                <div className={'logincontainer flex-right'} style={{marginTop: '24px'}}>
                    <div className={'font-primary'} onClick={() => {
                        toggleState()
                    }}>{
                        <p>New here? <span className={'color-green'} style={{cursor: 'pointer'}}> Register </span></p>
                    }</div>
                </div>
            </form>
        </div>
    )
}