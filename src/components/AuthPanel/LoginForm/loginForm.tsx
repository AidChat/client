import React, {useContext, useState} from 'react';
import {AuthContext} from "../../../services/context/auth.context";
import {Spinner} from "../../utility/spinner/spinner";

interface LoginFromProps {
    toggleState: () => void
}

export function LoginForm({toggleState}: LoginFromProps) {
    let context = useContext(AuthContext);
    function handleLogin() {
        _setLoad(true)
        context?.verifyAuthentication()
    }

    let [error, _seterror] = useState(null);
    let [loading, _setLoad] = useState(false)

    return (
        <div className={'loginFormWrapper'}>
            <form style={{width: '80%'}}>
                <div className={'logincontainer'}>{error}</div>
                <div className={'logincontainer'}>
                    <label style={{marginLeft: '4px'}}>Username</label>
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
                <div style={{marginTop: 10, display: 'flex', alignContent: "center", alignItems: 'center'}}>
                    <input type={'checkbox'} style={{height: 20, width: 20}}/>
                    <div>
                        <label className={'font-primary'}>Remember me</label>
                    </div>
                </div>
                <div className={'logincontainer flex-center'} >
                    <div className={'btn btn-primary w50'} onClick={() => {
                        handleLogin()
                    }}>{
                        loading ? <Spinner/> : 'Login'
                    }</div>
                </div>
                <div className={'logincontainer flex-right'} style={{marginTop: '24px'}}>
                    <div className={'font-primary'} onClick={() => {
                        toggleState()
                    }}>{
                        <p>New here?  <span className = {'color-green'} > Register </span></p>
                    }</div>
                </div>
            </form>
        </div>
    )
}