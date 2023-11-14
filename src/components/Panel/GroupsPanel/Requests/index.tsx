import React, {useEffect, useState} from "react";
import {Spinner} from "../../../utility/spinner/spinner";
import './index.css'
import {_props, reqType, service, serviceRoute} from "../../../../services/network/network";
import {validateEmail} from "../../../../utils/functions";
import {MdDelete, MdMarkEmailRead} from "react-icons/md";
import Snackbar from "../../../utility/Snackbar";

export function Requests(props: { groupId: string }) {
    const [data, setData] = useState(true);
    const [requests,_requests]= useState<Request[] | null>(null);
    function fetchData(){
        _props._db(service.group).query(serviceRoute.groupInvite, {}, reqType.get, props.groupId)
            .then((result) => {
                if (result.data.length) {
                    _requests(result.data);
                }
            })
    }

    useEffect(() => {
        fetchData()
    }, []);
    return (
        <div className={'members-container'}>
            {
                data ?
                    <div className={'font-primary'}>
                        <SendRequestPanelContainer fetch={()=>{fetchData()}} groupId={props.groupId}/>
                        <AllRequestsPanelContainer fetch={()=>{fetchData()}} requests={requests}/>
                    </div>
                    : <Spinner/>
            }
        </div>
    )
}


function SendRequestPanelContainer({groupId,fetch}: { groupId: string,fetch:()=>void }) {
    const [email, _email] = useState<string>('');
    const [loading,_loading] = useState<boolean>(false);
    const [message,_message] = useState<string | null>(null);

    function handleSendInvite() {
     if(!loading) {
         if (validateEmail(email)) {
             _loading(true);
             _props._db(service.group).query(serviceRoute.groupInvite, {'requestee': email}, reqType.post, groupId)
                 .then((result) => {
                     _message(result.message);
                     fetch();
                     _email('');
                     _loading(false);
                 })
                 .catch(error => {
                     _loading(false);
                     console.log(error)
                 })
         }
     }
    }

    return (

        <>
            {message && <Snackbar message={message} onClose={()=>{_message(null)}} /> }
            <form onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                handleSendInvite()
            }}>
                <div className={'requestWrapper'}>

                    <div className={'inputWrapper'}>
                        <input required={true} type={'email'} value={email} onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                handleSendInvite()
                            }
                        }} onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                            _email(e.target.value)
                        }} placeholder={'Please enter the email to send an invite'}
                               className={'sendInviteInput'}/>
                    </div>
                    <div className={'sendInviteBtn'}>
                        <div className={'btn btn-primary btn-custom'} onClick={() => {
                            handleSendInvite()
                        }}> {'Send Invite'}
                        </div>
                    </div>
                    {loading && <Spinner />}
                </div>
            </form>
        </>
    )
}

function AllRequestsPanelContainer({requests,fetch}: {fetch:()=>void , requests:Request[] | null }) {
    const [allRequests, _requests] = useState<Request[] | null>(requests)
    const [message, _message] = useState<string | null>(null);
    useEffect(() => {
        _requests(requests);
    }, [requests]);
    function handleDelete(requestId:number){
   _props._db(service.group).query(serviceRoute.groupInvite, {},reqType.delete,requestId)
       .then((response)=>{
           _message(response.message);
           fetch();
       })
    }
    return (
        <>
            {allRequests ? <>
                    { message && <Snackbar message={message} onClose={()=>{_message(null)}} />}
                    {allRequests.map((item: Request, index: number) =>
                        <div className={'shadow userlistWrapper'} key={index}>
                            <div> {item.invitee}</div>

                            <div className={'flex'}>
                                <div style={{marginRight:'8px'}}><MdDelete onClick={()=>{handleDelete(item.id)}} size={26}/> </div>
                                <MdMarkEmailRead size={26}/>
                            </div>
                        </div>
                    )
                    }
                </>
                :
                <div className={'noRequestWrapper'}>
                    No active requests yet!
                </div>}
        </>
    )
}

interface Request {
    groupId: number,
    id: number,
    invitee: string,
    type: string,
    userId: number
}