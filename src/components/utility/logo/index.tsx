import React from 'react';
import logo from './../../../assets/gifs/nameLogo.gif'
import './style.css'
export function Logo() {
    return (
        <div className={'logoWrapper'}>
            <img src={logo}/>
        </div>
    )
}