import moksha from './../../../assets/png/moksha.png'
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../../../services/context/app.context";
import {motion} from 'framer-motion';
import {confirmPopup} from "primereact/confirmpopup";


export function MokshaIcon({top, bottom, left, right, size, online,image, customstyle, showInfo,aider}: {
    top?: boolean,
    bottom?: boolean,
    right?: boolean,
    left?: boolean,
    size: 'small' | 'medium' | 'large',
    online: boolean,
    image?:string,
    customstyle?: {}, showInfo?: boolean,
    aider?:string
}) {
    const authContent = useContext(AppContext);
    const ref = useRef<HTMLDivElement>(null);
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

    const handleOptions =(element:any)=>{
        if(aider) {
            confirmPopup({
                target: element.currentTarget,
                message: "Do you wish to switch your helper?",
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Switch Helper',
                rejectLabel: 'Switch to Moksha',
                accept: function () {

                },
                reject: function () {

                }
            });
        }else{
            handleClick();
        }
        }


    return (
        <div className={`moksha-icon glow-border ${online ? 'glow-border-online' : 'glow-border-offline'}`}
             style={renderStyle()}  ref={ref}>
            {showInfo &&
                <motion.div
                    className="info-container"
                    initial={{opacity: 1}}
                    animate={{opacity: 0}}
                    transition={{duration: 2, delay: 2}}
                >
                    {aider? aider : 'Moksha'} is {online ? 'online' : 'offline'}
                </motion.div>}
            <img onClick={handleOptions}  height={'100%'} width={'100%'} style={{borderRadius:'50%'}} src={image? image :moksha} alt={'Moksha.ai'}/>

        </div>
    )
}