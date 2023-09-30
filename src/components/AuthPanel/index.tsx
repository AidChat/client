import React, {useState} from 'react';
import './index.css';
import {LoginForm} from "./LoginForm/loginForm";
import gif from './../../assets/gifs/slogan.gif';
import {RegisterForm} from "./RegisterForm";

export function Auth() {
    const [state, setState] = useState({
        login: true,
        register: false
    })

    function switchAuthState() {
        setState({
            login: !state.login,
            register: !state.register
        })
    }

    return (
        <div className={'authContainer'}>
            <div>
                <img src={gif}/>
            </div>
            <div className={'authBox'}>
                <div className={'w100'}>
                    {state.login && <LoginForm toggleState={switchAuthState}/>}
                    {state.register && <RegisterForm toggleState={switchAuthState}/>}
                </div>
            </div>
        </div>
    )
}