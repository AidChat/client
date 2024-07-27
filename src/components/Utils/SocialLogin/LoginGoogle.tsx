import {ReactNode, useCallback, useContext, useState} from "react";
import {IResolveParams, LoginSocialGoogle, objectType} from "reactjs-social-login";
import {_props} from "../../../services/network/network";
import {AppContext} from "../../../services/context/app.context";
import {useParams} from "react-router-dom";
import {ShellContext} from "../../../services/context/shell.context";
import {reqType, service, serviceRoute} from "../../../utils/enum";

const REDIRECT_URI = window.location.href;

export const LoginGoogle = ({children}: { children: ReactNode }) => {
    let context = useContext(AppContext);
    const {requestCode} = useParams()

    function handleLoginSuccess(data: objectType | undefined) {
        console.log(data)
        _props._db(service.authentication).query(serviceRoute.socialLogin, {
            access_token: data?.access_token,
            scope: data?.scope,
            requestId:requestCode
        }, reqType.post, undefined).then(response => {
            context?.verifyAuthentication(response.data.session.session_id,requestCode?true:false)
        })
    }

    return (
        <LoginSocialGoogle
            client_id={process.env.REACT_APP_GG_APP_ID || ''}
            onResolve={({provider, data}: IResolveParams) => {
                handleLoginSuccess(data)
            }}
            onReject={(err) => {
                console.log(err)
            }}
        >
            {children}
        </LoginSocialGoogle>
    )
}

