import React, {useContext, useState} from 'react';
import {AuthContext} from "../../../services/context/auth.context";
import {Spinner} from "../../utility/spinner/spinner";


interface RegisterFormProps{
    toggleState : ()=> void
}
export function RegisterForm({toggleState}:RegisterFormProps) {
    let context = useContext(AuthContext);

    function handleLogin() {
        _setLoad(true)
        context?.verifyAuthentication()
    }

    let [error, _seterror] = useState(null);
    let [loading, _setLoad] = useState(false)

    return (
        <div className={'loginFormWrapper'}>
            <form style={{width:'80%'}}>
                <div className={'logincontainer'}>{error}</div>
                <div className={'logincontainer'}>
                    <label style={{marginLeft:'4px'}}>Name</label>
                    <div className={'inputWrapper-icon'}>
                        <input type={'email'} className={'inputEle'}/>
                    </div>
                </div>
                <div className={'logincontainer'}>
                    <label style={{marginLeft:'4px'}}>Email</label>
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
                <div className={'logincontainer flex-center'} style={{marginTop:'24px'}}>
                    <div className={'btn btn-primary w50'} onClick={()=>{
                        handleLogin()
                    }}>{
                        loading ? <Spinner/> : 'Register'
                    }</div>
                </div>
                <div className={'logincontainer flex-right'} style={{marginTop:'24px'}}>
                    <div className={'font-primary'} onClick={()=>{
                        toggleState()
                    }}>{
                        'Already part of our community? Login'
                    }</div>
                </div>
            </form>
        </div>
    )
}