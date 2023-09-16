import React from 'react';
import './index.css';
import {LoginForm} from "./LoginForm/loginForm";
export function Auth(){
    return(
        <div className={'authContainer'}>
            <div className={'authBox'}>
               <div>
                   <LoginForm />
               </div>
            </div>
        </div>
    )
}