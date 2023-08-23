import React from 'react';
import styled from "styled-components";
export const Image =({height,width,name,type}:{height:string,width:string,name:string,type:string})=>{

    return (
       <Imagewrapper height={height} width={width}>
        <ImageEl src={require(`../../assets/${type}/${name}.${type}`)} alt={'logo'}/>
       </Imagewrapper>
           )
}

const Imagewrapper = styled.div<{height:string,width:string}>`
  height:${props => props.height};
  width:${props => props.width};
  margin:0 auto;
`;

const ImageEl = styled.img`
  height:100%;
  width: 100%;
`;