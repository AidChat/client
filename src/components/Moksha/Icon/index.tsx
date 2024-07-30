import moksha from './../../../assets/png/moksha.png'
import {useContext, useRef, useState} from "react";
import {AppContext} from "../../../services/context/app.context";
import {motion} from 'framer-motion';
import {confirmPopup} from "primereact/confirmpopup";
import {enString} from "../../../utils/strings/en";
import {Feedback} from "../../Feedback";
import {getString} from "../../../utils/strings";
import {_props} from "../../../services/network/network";
import {reqType, service, serviceRoute} from "../../../utils/enum";


export function MokshaIcon({
                               top,
                               bottom,
                               left,
                               right,
                               size,
                               online,
                               image,
                               customstyle,
                               showInfo,
                               aider,
                               id,
                               requestedSwitch,
                               removeAider
                           }: {
    top?: boolean,
    bottom?: boolean,
    right?: boolean,
    left?: boolean,
    size: 'small' | 'medium' | 'large',
    online: boolean,
    image?: string,
    customstyle?: {}, showInfo?: boolean,
    aider?: string,
    id?: string
    requestedSwitch?: () => void,
    removeAider?: () => void,
}) {
    const authContent = useContext(AppContext);
    const ref = useRef<HTMLDivElement>(null);
    const [showFeedback, setShowFeedback] = useState<boolean>(false);

    function handleClick() {
        if (authContent) {
            authContent.setConfession(true)
        }
    }


    function renderStyle() {
        let style = {...customstyle}
        if (top) {
            style = {...style, top: 0}
        }
        if (bottom) {
            style = {...style, bottom: 0}
        }
        if (right) {
            style = {...style, right: 0}
        }

        if (left) {
            style = {...style, left: 0}
        }
        switch (size) {
            case "small":
                style = {...style, height: '40px', width: '40px'}
                break;
            case "medium":
                style = {...style, height: '60px', width: '60px'}
                break;
            case "large":
                style = {...style, height: '80px', width: '80px'}
        }
        return style
    }

    const handleOptions = (element: any) => {
        if (aider) {
            confirmPopup({
                target: element.currentTarget,
                message: "Do you wish to switch your helper?",
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Switch Helper',
                rejectLabel: `Switch to ${getString(enString.botname)}`,
                accept: function () {
                    handleRemoveHelperProcess(true);
                },
                reject: function () {
                   requestedSwitch && requestedSwitch();
                }
            });
        } else {
            handleClick();
        }
    }

    function handleRemoveHelperProcess(pendingFeedback: boolean) {
        if (pendingFeedback) {
            setShowFeedback(true);
        } else {
            setShowFeedback(false);
            removeHelper();
        }
    }

    function removeHelper() {
        _props._db(service.group).query(serviceRoute.switchAider, undefined, reqType.post, undefined)
            .then(function (data) {
                removeAider && removeAider();
            })
            .catch(e => {
                console.log(e)
            })
    }

    return (
        <div className={`moksha-icon glow-border ${online ? 'glow-border-online' : 'glow-border-offline'}`}
             style={renderStyle()} ref={ref}>
            {showInfo &&
                <motion.div
                    className="info-container"
                    initial={{opacity: 1}}
                    animate={{opacity: 0}}
                    transition={{duration: 2, delay: 2}}
                >
                    {aider ? aider : 'Moksha'} is {online ? 'online' : 'offline'}
                </motion.div>}
            {id && aider && <Feedback username={aider} helperId={id} open={showFeedback} onClose={() => {
                handleRemoveHelperProcess(false)
            }}/>}
            <img onClick={handleOptions} height={'100%'} width={'100%'} style={{borderRadius: '50%'}}
                 src={image ? image : moksha} alt={'Moksha.ai'}/>

        </div>
    )
}