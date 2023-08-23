import React, { useState} from 'react';
import {CustomAlign, CustomMargin} from "../utility/alignment.components";
import {Spinner} from "../utility/loader.component";
import {LinksEl} from "../Header";
import {AuthContainer, FormContainer, InputButton, InputLabel, TextInput} from "./login.component";
import {useNavigate} from "react-router-dom";
import {getString} from "../../utils/strings";
import {enString} from "../../utils/strings/en";
import {OtpContainer} from "../utility/containers.component";


export function RegisterComponent({handleSwitch}: { handleSwitch: (E: string) => void }) {
    const [loading, setLoading] = useState(false);
    const [requestedOtp, UpdateRequest] = useState(false);
    const [state, setState] = useState<{ email: string, password: string, name: string, contact: string }>({
        email: '',
        password: '',
        name: '',
        contact: ''
    })
    let navigation = useNavigate();
    const handleChange = (e: any) => {
        e.preventDefault()
        setState({
            email: e.target.form[1].value,
            password: e.target.form[2].value,
            name: e.target.form[0].value,
            contact: e.target.form[3].value
        });
    }
    const handleSubmit = ()=>{
        UpdateRequest(true);
    }


    return (
        <AuthContainer>
            {requestedOtp ? <OtpContainer handleback={(val:boolean)=>UpdateRequest(val)} />  :
                <FormContainer style={{height:'90%'}} onSubmit={handleSubmit}>
                    <InputLabel>{getString(enString.name)}</InputLabel>
                    <TextInput value={state.name} onInput={handleChange} required type={'name'}/>
                    <InputLabel>{getString(enString.email)}</InputLabel>
                    <TextInput value={state.email} onInput={handleChange} required type={'email'}/>
                    <InputLabel>{getString(enString.password)}</InputLabel>
                    <TextInput onInput={handleChange} value={state.password} required type={'password'}/>
                    <InputLabel>{getString(enString.contact)}</InputLabel>
                    <TextInput onInput={handleChange} value={state.contact} required type={'tel'} placeholder={''}/>
                    <CustomMargin mt={'10'}>
                        {!loading ? <InputButton type={'submit'} value={'Register'}/> : Spinner()}
                    </CustomMargin>
                    <CustomMargin mt={'5'}>
                        <CustomAlign align={'right'}>
                            <LinksEl color={'black'} onClick={() => handleSwitch('login')}>{getString(enString.alreadyContributing)}</LinksEl>
                        </CustomAlign>
                    </CustomMargin>
                </FormContainer>}
        </AuthContainer>
    )
}


