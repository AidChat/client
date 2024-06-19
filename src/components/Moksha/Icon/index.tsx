import moksha from './../../../assets/png/moksha.png'
import Tooltip from "../../Utils/Tooltip";
import {useContext} from "react";
import {AuthContext} from "../../../services/context/auth.context";
import {getString} from "../../../utils/strings";

export function MokshaIcon({top, bottom, left, right,size,online}: {
    top?: boolean,
    bottom?: boolean,
    right?: boolean,
    left?: boolean,
    size:'small' | 'medium' | 'large',
    online:boolean
}) {
    const authContent = useContext(AuthContext)

    function handleClick() {
        if (authContent) {
            authContent.setConfession(true)
        }
    }

    function renderStyle() {
        let style = {}
        if (top) {
            style = {...style,top: 0}
        }
        if (bottom) {
            style = {...style,bottom: 0}
        }
        if (right) {
            style = {...style,right: 0}
        }

        if (left) {
            style = {...style,left: 0}
        }
       switch (size) {
           case "small":
               style = {...style,height:'40px',width:'40px'}
               break;
               case "medium":
                   style = {...style,height:'60px',width:'60px'}
               break;
                   case "large":
                       style = {...style,height:'80px',width:'80px'}
       }
        return style
    }

    return (
        <div className={`moksha-icon glow-border ${online ?'glow-border-online':'glow-border-offline'}`} style={renderStyle()}>
            <Tooltip text={ online ? `${getString(24)} online` : `${getString(24)} offline`}>
                <img onClick={() => handleClick()} height={'100%'} width={'100%'} src={moksha} alt={'Moksha.ai'}/>
            </Tooltip>
        </div>
    )
}