import React from 'react';
import {AlignCenter, CenterBox, CustomMargin} from "../utility/alignment.components";
import {Input} from "../utility/input.component";
import {Button} from "../utility/button.component";
import {Image} from "../utility/logo.component";

export const SearchBox = () => {
    return (
        <CenterBox>
            <CustomMargin mb={'30'}>
                <Image name={'Aidchat-logos_transparent_2'} height={'20%'} width={'30%'}  type={'svg'}/>
            </CustomMargin>
            <Input/>
            <CustomMargin mt={'30'}>
                <Button color={'whitesmoke'} click={()=>{}}> <AlignCenter style={{color:'#202124'}}>  Search </AlignCenter></Button>
            </CustomMargin>
        </CenterBox>
    )
}