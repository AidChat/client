import moksha from './../../../assets/png/moksha.png'
import Tooltip from "../../Utils/Tooltip";
import {useContext} from "react";
import {AuthContext} from "../../../services/context/auth.context";

export function MokshaIcon() {
    const authContent = useContext(AuthContext)

    function handleClick() {
        if (authContent) {
            authContent.setConfession(true)
        }
    }

    return (
        <div className={'moksha-icon'}>
            <Tooltip text={'moksha'}>
                <img onClick={()=>handleClick()} height={'100%'} width={'100%'} src={moksha} alt={'Moksha.ai'}/>
            </Tooltip>
        </div>
    )
}