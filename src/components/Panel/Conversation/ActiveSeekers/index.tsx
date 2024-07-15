import React, {useContext, useEffect, useState} from "react";
import {GroupList} from "../GroupList";
import {_props} from "../../../../services/network/network";
import {reqType, service, serviceRoute} from "../../../../utils/enum";
import {ShellContext} from "../../../../services/context/shell.context";
import {SocketListeners} from "../../../../utils/interface";

export function ActiveSeeker() {
    const [activeSeekerGroup, setActiveSeekerGroup] = useState<any>([]);
    const sc = useContext(ShellContext)
    useEffect(() => {
        _props._db(service.group).query(serviceRoute.seekers,undefined,reqType.get,undefined ).then(function ({data}){
            setActiveSeekerGroup(data);
        })
        sc?.globalSocket?.on(SocketListeners.NEWGROUP,function (data: any){
            console.log("[socket]",data)
            setActiveSeekerGroup([data, ...activeSeekerGroup]);
            new Notification("Someone is looking for mental support.")
        })
    }, []);
    return (
        activeSeekerGroup.length >  0 ?
        <div>
            <GroupList listType={"JOIN"} items={activeSeekerGroup}/>

        </div>
            :
            <>
            <div className={'font-primary flex flex-center p8 font-medium'}>
                No Active Seekers
            </div>
            </>
    )
}

