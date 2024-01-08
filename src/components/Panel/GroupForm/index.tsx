import React, {useContext, useEffect, useState} from 'react';
import './index.css'
import {groupTokensArray} from "../../../assets/data";
import {Search} from "../../utility/Select";
import {AiOutlineCloseCircle} from "react-icons/ai";
import {_props, reqType, service, serviceRoute} from "../../../services/network/network";
import {ShellContext} from "../../../services/context/shell.context";
import Snackbar from "../../utility/Snackbar";
import {Spinner} from "../../utility/Spinner/spinner";
import ImageUploader from "react-images-upload";
import group from './../../../assets/svg/groups.svg'

interface _gfIterface {
    onSubmit?: () => void,
    onError?: () => void
}

interface GroupFormStateInterface {
    name: string,
    description: string,
    keywords: string[],
    requestee: string
    icon?: string
}

export function GroupForm({onSubmit, onError}: _gfIterface) {
    const [state, _state] = useState<GroupFormStateInterface>({
        name: '',
        description: '',
        keywords: [],
        requestee: '',
        icon: undefined

    })
    const {ping} = useContext(ShellContext)
    const [message, _message] = useState<string | null>(null);
    const [loading, _loading] = useState<boolean>(false);

    function resetState() {
        _state({name: '', description: '', keywords: [], requestee: ''});
        _loading(false)
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
            _loading(true)
            _props._db(service.group).query(serviceRoute.group, state, reqType.post, undefined)
                .then(result => {
                    if (onSubmit) {
                        resetState();
                        ping();
                        onSubmit();

                    }
                    _loading(false)
                })
                .catch(error => {
                    _loading(false);
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

    function handleImageUpload(e: any) {
        const file = e[0];
        const reader = new FileReader();
        reader.onloadend = function () {
            if (reader && reader.result) {
                if (typeof reader.result === "string") {
                    const base64String = reader.result;
                    _state({...state, icon: base64String});
                }
            }
        };
        reader.readAsDataURL(file);
    }

    return (<>
            {message && <Snackbar message={message} onClose={() => {
                _message('')
            }}/>}
            {loading && <Spinner/>}
            <div className={'groupFormContainer'}>
                <div className={'groupFormEleWrapper'}>
                    <form onSubmit={handleSubmit}>
                        <div className={'formEleWrapper iconSection'}>
                            <div style={{height: '120px', width: '120px'}}>
                                <img src={state.icon ? state.icon : group} alt={'group icon'} style={{height: '100%', width: '100%',borderRadius:'50%'}}/>
                            </div>
                            <div>
                                <ImageUploader
                                    className={'imageUploader'}
                                    withIcon={false}
                                    singleImage={true}
                                    buttonText='Update'
                                    label={''}
                                    onChange={(e) => {
                                        handleImageUpload(e)
                                    }}
                                    imgExtension={['.jpeg', '.gif', '.png', '.gif','.jpg']}
                                    maxFileSize={5242880}
                                />
                            </div>
                        </div>
                        <div className={'formEleWrapper'}>
                            <input name={'name'} onChange={handleChange} required={true} value={state.name}
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
                                   value={state.description}
                                   className={'borderRadius-light custom-input-people borderRadius-heavy'} type={'text'}
                                   placeholder={'Write some description about your group'}/>

                            <div className={'sendInviteWrapper block'}>
                                <div className={'brick'}>
                                    <input type={'email'} name={'requestee'} onChange={handleChange}
                                           value={state.requestee} required
                                           className={'borderRadius-light custom-input w100'}
                                           placeholder={'Enter his/her email'}/>
                                </div>
                                <div className={'btn btn-round-primary'} onClick={() => {
                                    _message('Invitation will be sent post group creation.')
                                }}>
                                    Send invite
                                </div>
                            </div>
                        </div>
                        <div className={'flex sendBtnWrapper'}>
                            <div className={'btn btn-round-secondary'} onClick={(e) => handleSubmit()}>Create</div>
                        </div>
                    </form>
                    {message && <Snackbar message={message} onClose={() => {
                        _message(null)
                    }}/>}
                </div>
            </div>
        </>
    )
}