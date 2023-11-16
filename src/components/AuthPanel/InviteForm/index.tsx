import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import notfoundCat from './../../../assets/svg/notfound_cat.svg';
import './index.css'
import {_props, reqType, service, serviceRoute} from "../../../services/network/network";
import {Spinner} from "../../utility/spinner/spinner";


interface requestInt {
    id: number,
    groupId: number,
    userId: number,
    type: string,
    invitee: string,
    group: {
        id: number,
        name: string,
        created_at: string,
        socketId: number,
        groupDetailId: number,
        GroupDetail: {
            tags: string[],
            id: number
        }
    },
    user: {
        name: string
    }
}

export function InviteForm({requestLogin}: { requestLogin: (email?:string) => void }) {
    const {requestCode} = useParams();
    const [request, _request] = useState<requestInt | null>(null)
    const [validRequest, _valid] = useState(false);
    const [loading, _loading] = useState<boolean>(true);
    const [validSession, _invalid] = useState<boolean>(false)
    useEffect(() => {
        debugger
        if (!requestCode) {
            _valid(false);
            _loading(false);
        } else {
            _loading(true);
            _props._db(service.group).query(serviceRoute.request, {}, reqType.get, requestCode)
                .then(response => {
                    console.log(response)

                    _request(response.data);
                    _valid(true)
                    if(!response.data){
                        _valid(false)
                    }
                    // check for user session
                    _props._user().validateSession().then((result: any) => {
                        console.log(result,response)
                        if (result.data.email.data === response.data.invitee) {
                            _invalid(true)
                        } else {
                            _invalid(false)
                        }
                        _loading(false);
                    })
                        .catch(result => {
                            _loading(false);
                            _invalid(false)
                        })

                    // if user matches the invitee then give option to Join -> Click on join then remove request and reload
                    // no session then user register form and send requestId with register request.

                })
                .catch(error => {
                    console.log(error);
                    _loading(false);
                    _valid(false)
                })
        }
    }, []);

    function handleRequest() {
        console.log(validSession)
        if (validSession) {

            // make joining request
        } else {
            // remove previous session;
            window.localStorage.removeItem('session');
            requestLogin(request?.invitee);
            // show login register;
        }
    }

    return (
        <div className={'requestContainer'}>
            {loading ? <Spinner/> :
                validRequest ? <>
                        {request?.group.name}
                        {validSession ? <>
                            <div className={'btn btn-round-secondary'} onClick={() => {
                                handleRequest()
                            }}>
                                Join
                            </div>
                        </> : <>
                            <div className={'btn btn-round-secondary'} onClick={() => {
                                handleRequest();
                            }}>
                                Join
                            </div>
                        </>}
                    </> :
                    <>
                        <div className={'requestContainer-image'}>
                            <img src={notfoundCat} style={{height: '100%', width: '100%'}} alt={'Not found'}/>

                        </div>
                        <div className={'btn-wrapper'}>
                            <div className={'btn btn-primary btn-custom'} onClick={() => {requestLogin()}}>
                                Login
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}

