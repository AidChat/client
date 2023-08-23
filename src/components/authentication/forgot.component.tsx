import React, {FormEvent, useEffect, useState} from 'react';
import {AlignCenter, CenterBox, CustomAlign, CustomMargin, FlexBox} from "../utility/alignment.components";
import {Spinner} from "../utility/loader.component";
import {LinksEl} from "../Header";
import {AuthContainer, FormContainer, InputButton, InputLabel, TextInput} from "./login.component";
import {getString} from "../../utils/strings";
import {enString} from "../../utils/strings/en";
import {OtpContainer} from "../utility/containers.component";


export function ForgotComponent({handleSwitch}:{handleSwitch:(E:string)=> void}){
    const [loading, setLoading] = useState(false);
    const [showOtp,setShowOtp] = useState(false);
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setShowOtp(true)
    }
    useEffect(()=>{
      setLoading(false)
    },[])
    return(
        <AuthContainer>
            {showOtp ? <OtpContainer handleback={setShowOtp}  /> :
            <FormContainer style={{height:'50%'}} onSubmit={handleSubmit}>
                <InputLabel>{getString(enString.email)}</InputLabel>
                <TextInput type={'email'} placeholder={''}/>
                {/*<InputLabel>{getEnString(enString.contact)}</InputLabel>
                <TextInput type={'tel'} placeholder={''}/>*/}

                <CustomMargin mt={'10'}>
                    {!loading ? <InputButton type={'submit'} value={'Verify'}/> : Spinner()}
                </CustomMargin>
                <CustomMargin mt={'5'}>
                    <CustomAlign align={'right'}>
                        <LinksEl color={'black'} onClick={()=>{handleSwitch('login')}} >{getString(enString.backToLogin)}</LinksEl>
                    </CustomAlign>
                </CustomMargin>
            </FormContainer>
            }
        </AuthContainer>
    )
}