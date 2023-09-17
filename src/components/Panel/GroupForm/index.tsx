import React from 'react';
import './index.css'

interface _gfIterface {
    onSubmit?: () => void,
    onError?: () => void
}

export function GroupForm({onSubmit, onError}: _gfIterface) {
    return (<>
        <div className={'groupFormContainer'}>
            <div className={'groupFormEleWrapper'}>
                <form>
                    <div className={'formEleWrapper'}>
                        <input className={'borderRadius-light custom-input'}  type={'text'}
                               placeholder={'Choose a name that explains the purpose'}/>
                    </div>
                    <div className={'formEleWrapper'}>
                        <input className={'borderRadius-light custom-input-people borderRadius-heavy'} type={'text'}
                               placeholder={'Add someone who can can be aided'}/>
                        <div className={'sendInviteWrapper block'}>
                            <div className={'brick'}>
                                <input type={'email'} required className={'borderRadius-light custom-input w100'}
                                       placeholder={'Enter his/her email'}/>
                            </div>
                                <div className={'btn btn-round-primary'} >
                                Send invite</div>
                            </div>
                        </div>
                    <div className={'flex sendBtnWrapper'}>
                        <div className={'btn btn-round-secondary'}>Create</div>
                    </div>
                </form>
            </div>
        </div>
    </>
)
}