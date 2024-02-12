import React from 'react';
import gif from '../../assets/gifs/nameLogo.gif'
import './concent.page.css'
import {en, enString} from "../../utils/strings/en";
import {_props, reqType, service, serviceRoute} from "../../services/network/network";

export function UserDetailsForm() {
    const handleClick = ()=>{
        _props._db(service.authentication).query(serviceRoute.consent, {type:'Helper'},reqType.put,undefined).then(()=>{
            window.location.reload();
        })
    }

    return (
        <div className={'consent-wrapper'}>
            <div className={'consent-image-container'}>
                <div className={'consent-image-wrapper'}>
                    <img className={'consent-image'} src={gif}/>
                </div>
            </div>
            <div dangerouslySetInnerHTML={{__html: en[enString.consent]}} className={'consent-text'}>
            </div>
            <div className={'consent-btn-wrapper'}>
                <div className={'btn btn-primary btn-custom '} onClick={handleClick}> I understand the terms and I wish to continue</div>
            </div>
        </div>
    )
}




