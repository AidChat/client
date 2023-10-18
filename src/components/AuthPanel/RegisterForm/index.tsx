import React, {ChangeEvent, FormEvent, FormEventHandler, FormHTMLAttributes, useEffect, useState} from 'react';
import {_props, reqType, service, serviceRoute} from "../../../services/network/network";


interface RegisterFormProps {
    toggleState: () => void
}

export function RegisterForm({toggleState}: RegisterFormProps) {
    const [state,setState]= useState<{name?:string,email?:string,password?:string}>({
        name:undefined,
        email:undefined,
        password:undefined
    });
    let [error, _seterror] = useState(null);
    function handleLogin(e:FormEvent) {
        e.preventDefault();
        _props._db(service.authentication).query(serviceRoute.register, state,reqType.post).then(result=>{
            toggleState();
        })
            .catch((reason)=>{
                console.log(reason)
                _seterror(reason.data.message)
            })
    }
    function handleUpdate(event:ChangeEvent<HTMLInputElement>){
        event.preventDefault()
        let {name,value} = event.target;
        setState({
            ...state,
            [name]:value
        })
    }

    useEffect(() => {
       window.setTimeout(()=>{
           _seterror(null)
       },3000)
    }, [error]);



    return (
        <div className={'loginFormWrapper'}>
            <form style={{width: '80%'}} onSubmit={handleLogin}>
                <div className={'logincontainer center font-primary'}>{error}</div>
                <div className={'logincontainer'}>
                    <label style={{marginLeft: '4px'}}>Name</label>
                    <div className={'inputWrapper-icon'}>
                        <input type={'name'} name={'name'} onChange={handleUpdate} className={'inputEle'}/>
                    </div>
                </div>
                <div className={'logincontainer'}>
                    <label style={{marginLeft: '4px'}}>Email</label>
                    <div className={'inputWrapper-icon'}>
                        <input type={'email'} name={'email'} onChange={handleUpdate} className={'inputEle'}/>
                    </div>
                </div>
                <div className={'logincontainer'}>
                    <label>Password</label>
                    <div className={'inputWrapper-icon'}>
                        <input type={'password'} name={'password'} onChange={handleUpdate} className={'inputEle'}/>
                    </div>
                </div>
                <div className={'logincontainer flex-center'}>
                    <input type={'submit'} className={'btn btn-primary w50'} value={'Register'}></input>
                </div>
                <div className={'logincontainer flex-right'} style={{marginTop: '24px'}}>
                    <div className={'font-primary'} onClick={() => {
                        toggleState()
                    }}>
                        <p>Already part of our community?  <span className = {'color-green'} > Login </span></p>
                    </div>
                        </div>
                        </form>
                        </div>
                        )
                    }