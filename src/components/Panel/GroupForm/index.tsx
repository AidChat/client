import React, {useContext, useEffect, useState} from 'react';
import './index.css'
import {groupTokensArray} from "../../../assets/data";
import {Search} from "../../utility/Select";
import {AiOutlineCloseCircle} from "react-icons/ai";
import {Snackbar} from "../../utility/Snackbar";
import {_props, reqType, service, serviceRoute} from "../../../services/network/network";
import {ShellContext} from "../../../services/context/shell.context";

interface _gfIterface {
    onSubmit?: () => void,
    onError?: () => void
}

interface GroupFormStateInterface {
    name: string | null,
    description: string | null,
    keywords: string[]
}

export function GroupForm({onSubmit, onError}: _gfIterface) {
    const [state, _state] = useState<GroupFormStateInterface>({
        name: null,
        description: null,
        keywords: [],

    })
    const {ping} = useContext(ShellContext)
    const [message, _message] = useState<string | null>(null);

    function resetState() {
        _state({name: null, description: null, keywords: []});
    }

    function handleKeywords(s: string) {
        _state({...state, keywords: [...state.keywords, s]})
    }

    function removeKeyword(s: string) {
        let keywords = state.keywords.filter(item => item !== s);
        _state({...state, keywords: keywords});
    }

    function handleSubmit(e?: { preventDefault: () => void; }) {
        e?.preventDefault();
        if (!state.name || !state.description || !state.keywords.length) {
            _message("Please be more descriptive. This would really have a great impact.")
            window.setTimeout(() => {
                _message(null)
            }, 10000)
        } else {
            _props._db(service.group).query(serviceRoute.group, state, reqType.post, undefined)
                .then(result => {
                    if (onSubmit) {
                        ping();
                        onSubmit();
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        }
    }

    function handleChange(e: { target: { name: any; value: any; }; }) {
        _state({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        return () => {
            resetState();
        }
    }, []);
    return (<>
            {message && <Snackbar message={message}/>}
            <div className={'groupFormContainer'}>
                <div className={'groupFormEleWrapper'}>
                    <form onSubmit={handleSubmit}>
                        <div className={'formEleWrapper'}>
                            <input name={'name'} onChange={handleChange} required={true}
                                   className={'borderRadius-light custom-input'} type={'text'}
                                   placeholder={'Choose a name that explains the purpose'}/>
                        </div>
                        <div className={'formEleWrapper token-section'}>
                            <div style={{position: 'relative', width: '100%'}}>
                                <Search onSelect={(s: string) => {
                                    handleKeywords(s)
                                }} dataList={groupTokensArray}/>
                            </div>
                            <div className={'selected-token'}>
                                {state.keywords.map(item => {
                                    return <div className={'tokens'}>{item} <span
                                        className={'close'}><AiOutlineCloseCircle onClick={() => removeKeyword(item)}/></span>
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className={'formEleWrapper'}>
                            <input required={true} name={'description'} onChange={handleChange}
                                   className={'borderRadius-light custom-input-people borderRadius-heavy'} type={'text'}
                                   placeholder={'Write some description about your group'}/>

                            <div className={'sendInviteWrapper block'}>
                                <div className={'brick'}>
                                    <input type={'email'} required className={'borderRadius-light custom-input w100'}
                                           placeholder={'Enter his/her email'}/>
                                </div>
                                <div className={'btn btn-round-primary'}>
                                    Send invite
                                </div>
                            </div>
                        </div>
                        <div className={'flex sendBtnWrapper'}>
                            <div className={'btn btn-round-secondary'} onClick={(e) => handleSubmit()}>Create</div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}