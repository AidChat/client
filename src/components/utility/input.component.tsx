import React from 'react';
import styled from "styled-components";
import {useScreen} from "../../utils/hooks/screen";

export const Input = () => {
    let [size] = useScreen();
    console.log(size)
    function handleString() : string{
        if(size == 'md') return 'John Electrician'
        if(size == 'sm') return 'John Electrician'
        return 'Search for keywords eg. John Electrician'
    }
    return (
        <InputWrapper>
            <InputEl placeholder={handleString()}/>
        </InputWrapper>
    )
}

const InputEl = styled.input`
  border: none;
  width: 98%;
  text-align: center;
  background: transparent;
  color: whitesmoke;
`;

const InputWrapper = styled.div`
  border: .0009em solid white;
  max-width: 50vw;
  padding: 8px;
  margin: 2px;
  border-radius: 20px;
  text-align: center;
  margin:0 auto;
`;