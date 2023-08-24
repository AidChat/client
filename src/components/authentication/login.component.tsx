import React, {FormEvent, useState} from "react";
import styled from "styled-components";
import {Button} from "../utility/button.component";
import {LinksEl} from "../utility/elements.component";
import {
  AlignCenter,
  CustomAlign,
  CustomMargin,
} from "../utility/alignment.components";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;
import {Spinner} from "../utility/loader.component";
import {useNavigate} from "react-router-dom";
import {getString} from "../../utils/strings";
import {en, enString} from "../../utils/strings/en";

export function LoginComponent({
  handleSwitch,
}: {
  handleSwitch: (E: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<{
    email: string | null;
    password: string | null;
  }>({email: null, password: null});
  let navigation = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setState({email: e.target[0].value, password: e.target[1].value});
    judgeUser();
  };
  function judgeUser() {
    navigation("/report");
  }
  return (
    <AuthContainer>
      <FormContainer onSubmit={handleSubmit}>
        <InputLabel>{getString(enString.email)}</InputLabel>
        <TextInput type={"email"} placeholder={"Email"} />
        <InputLabel>{getString(enString.password)}</InputLabel>
        <TextInput type={"password"} />
        <CustomMargin mt={"10"}>
          {!loading ? (
            <InputButton type={"submit"} value={"Login"} />
          ) : (
            <CustomAlign style={{margin: "0 auto"}} align={"center"}>
              {Spinner()}
            </CustomAlign>
          )}
        </CustomMargin>
        <CustomMargin mt={"5"}>
          <CustomAlign align={"right"}>
            <LinksEl onClick={() => handleSwitch("forget")} color={"black"}>
              {getString(enString.forgetPassword)}
            </LinksEl>
          </CustomAlign>
        </CustomMargin>
        <CustomMargin mt={"5"}>
          <CustomAlign align={"right"}>
            <LinksEl onClick={() => handleSwitch("register")} color={"black"}>
              {getString(enString.notcontributedyet)}
            </LinksEl>
          </CustomAlign>
        </CustomMargin>
      </FormContainer>
    </AuthContainer>
  );
}

export const InputButton = styled.input`
  border-radius: 4px;
  border: none;
  width: 100%;
  padding: 8px 10px;
  cursor: pointer;
  font-size:20px;
`;

export const TextInput = styled.input`
  width: 100%;
  border: 2px solid black;
  border-radius: 2px;
  height: 30px;
  background: whitesmoke;
`;

export const InputLabel = styled.label`
  font-size: 16px;
`;

export const AuthContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  padding: 0px 40px;
`;
export const FormContainer = styled.form`
  display: flex;
  height: 70%;
  width: 100%;
  align-self: center;
  justify-content: center;
  justify-self: center;
  flex-direction: column;
  justify-content: space-around;
`;
