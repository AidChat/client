import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import notfoundCat from './../../../assets/svg/notfound_cat.svg';
import './index.css'
import {_props} from "../../../services/network/network";
import {Spinner} from "../../Utils/Spinner/spinner";
import {reqType, service, serviceRoute} from "../../../utils/enum";


interface requestInt {
    id: string,
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

export function InviteForm({requestLogin}: { requestLogin: (s:'LOGIN' | "REGISTER",email?:string) => void }) {
    const {requestCode} = useParams();
    const [request, _request] = useState<requestInt | null>(null)
    const [validRequest, _valid] = useState(false);
    const [loading, _loading] = useState<boolean>(true);
    const [validSession, _invalid] = useState<boolean>(false);
    const navigate = useNavigate()
    useEffect(() => {
        if (!requestCode) {
            _valid(false);
            _loading(false);
        } else {
            _loading(true);
            _props._db(service.group).query(serviceRoute.request, {}, reqType.get, requestCode)
                .then(response => {
                    _request(response.data);
                    _valid(true)
                    if(!response.data){
                        _valid(false)
                    }
                    // check for user session
                    _props._user().validateSession().then((result: any) => {
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

                })
                .catch(error => {
                    console.log(error);
                    _loading(false);
                    _valid(false)
                })
        }
    }, []);

    function handleRequest() {
        if (validSession) {
            _loading(true)
            _props._db(service.group).query(serviceRoute.request, {},reqType.put,request?.id)
                .then(()=>{
                    navigate('/');
                    window.location.reload();
                })
        } else {
            window.localStorage.removeItem('session');
            requestLogin("REGISTER",request?.invitee);
        }
    }

    return (
        <div className={'requestContainer'}>
            {loading ? <Spinner/> :
                validRequest ? <>
                        {request?.group.name}

                            <div className={'btn btn-round-secondary'} onClick={() => {
                                handleRequest();
                            }}>
                                Join
                            </div>

                    </> :
                    <>
                        <div className={'requestContainer-image'}>
                            <img src={notfoundCat} style={{height: '100%', width: '100%'}} alt={'Not found'}/>

                        </div>
                        <div className={'btn-wrapper'}>
                            <div className={'btn btn-primary btn-custom'} onClick={() => {requestLogin("LOGIN")}}>
                                Login
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}

