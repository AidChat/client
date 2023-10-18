import React, {ChangeEvent, FormEvent, useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../../services/context/auth.context";
import {_props, reqType, service, serviceRoute} from "../../../services/network/network";
import {Spinner} from "../../utility/spinner/spinner";

interface LoginFromProps {
    toggleState: () => void
}

export function LoginForm({toggleState}: LoginFromProps) {
    let context = useContext(AuthContext);
    const [userdata, setUserData] = useState<{ email: any, password: any, extend: boolean }>({
        email: undefined,
        password: undefined,
        extend: false
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
                console.log(response)
                context?.verifyAuthentication(response.session.session_id)
                _loading(false);
            }
        )
            .catch((reason) => {
                console.log(reason)
                setError(reason?.message)
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
                    <input type={'checkbox'} style={{height: 20, width: 20}} name={'extend'}
                           onClick={() => setUserData({...userdata, extend: !userdata.extend})}/>
                    <div>
                        <label className={'font-primary'}>Remember me</label>
                    </div>
                </div>
                <div className={'logincontainer flex-center'}>
                    {loading ? <Spinner></Spinner> :
                        <input type={'submit'} className={'btn btn-primary w50'} value={'Login'}></input>
                    }</div>
                <div className={'logincontainer flex-right'} style={{marginTop: '24px'}}>
                    <div className={'font-primary'} onClick={() => {
                        toggleState()
                    }}>{
                        <p>New here? <span className={'color-green'}> Register </span></p>
                    }</div>
                </div>
            </form>
        </div>
    )
}