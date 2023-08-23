import React, {ReactElement} from 'react';
import {Image} from "./logo.component";
import {CustomMargin} from "./alignment.components";

export function Tooltip({InfoEl}:{InfoEl:ReactElement}){


    return (
        <div className="tooltip"><CustomMargin ><Image height={'18px'} width={'18px'} name={'info'} type={'png'} /></CustomMargin>
            <span className="tooltiptext">{InfoEl}</span>
        </div>
    )
}