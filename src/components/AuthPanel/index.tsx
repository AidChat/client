import React from 'react';
import './index.css';
import {LoginForm} from "./LoginForm/loginForm";
import gif from './../../assets/gifs/slogan.gif';
export function Auth(){
    return(
        <div className={'authContainer'}>
            <div>
                <img src={gif} />
            </div>
            <div className={'authBox'}>
               <div className={'w100'}>
                   <LoginForm />
               </div>
            </div>
        </div>
    )
}