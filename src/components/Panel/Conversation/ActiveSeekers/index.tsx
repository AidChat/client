import React, {useEffect, useState} from "react";
import {GroupList} from "../GroupList";
import {_props} from "../../../../services/network/network";
import {reqType, service, serviceRoute} from "../../../../utils/enum";

export function ActiveSeeker() {
    const [activeSeekerGroup, setActiveSeekerGroup] = useState([]);
    useEffect(() => {
        _props._db(service.group).query(serviceRoute.seekers,undefined,reqType.get,undefined ).then(function ({data}){
            setActiveSeekerGroup(data);
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

