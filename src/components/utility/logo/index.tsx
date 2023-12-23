import React from 'react';
import logo from './../../../assets/png/logo.png'
import './style.css'
export function Logo() {
    return (
        <div className={'logoWrapper'}>
            <img src={logo}/>
        </div>
    )
}