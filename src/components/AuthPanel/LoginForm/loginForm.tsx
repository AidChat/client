import React, {useContext, useState} from 'react';
import {AuthContext} from "../../../services/context/auth.context";
import {Spinner} from "../../utility/spinner/spinner";

export function LoginForm() {
    let context = useContext(AuthContext);

    function handleLogin() {
        _setLoad(true)
        context?.verifyAuthentication()
    }

    let [error, _seterror] = useState(null);
    let [loading, _setLoad] = useState(false)

    return (
        <div className={'loginFormWrapper'}>
            <form style={{width:'75%'}}>
                <div className={'logincontainer'}>{error}</div>
                <div className={'logincontainer'}>
                    <label style={{marginLeft:'4px'}}>Username</label>
                    <div className={'inputWrapper-icon'}>
                        <input type={'email'} className={'inputEle'}/>
                    </div>
                </div>
                <div className={'logincontainer'}>
                    <label>Password</label>
                    <div className={'inputWrapper-icon'}>
                        <input type={'password'} className={'inputEle'}/>
                    </div>
                </div>
                <div className={'logincontainer flex-center'}>
                    <div className={'btn btn-primary w50'} onClick={()=>{
                        handleLogin()
                    }}>{
                        loading ? <Spinner/> : 'Login'
                    }</div>
                </div>
            </form>
        </div>
    )
}