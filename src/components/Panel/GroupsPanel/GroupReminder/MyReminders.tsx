import {ReactElement, useEffect} from "react";
import {reqType, service, serviceRoute} from "../../../../utils/enum";
import {_props} from "../../../../services/network/network";

export function MyReminders({groupId}: { groupId: number }): ReactElement {
    useEffect(() => {
        _props._db(service.group).query(serviceRoute.groupReminder, undefined, reqType.get, groupId)
            .then(function (result) {
                console.log(result)
            })
    }, []);
    return (<>

    </>)
}