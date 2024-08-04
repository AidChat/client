import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {_props} from "../../../services/network/network";
import {useParams} from "react-router-dom";
import {Spinner} from "../../Utils/Spinner/spinner";
import {reqType, service, serviceRoute} from "../../../utils/enum";
import {motion} from "framer-motion";
import Snackbar from "../../Utils/Snackbar";
import {Input} from "../../Utils/CustomInput";
import {CiUser} from "react-icons/ci";
import {FiPhone} from "react-icons/fi";
import {MdOutlineAlternateEmail} from "react-icons/md";
import {FaRegEye, FaRegUser} from "react-icons/fa";
import {userInfo} from "os";

interface RegisterFormProps {
  toggleState: (
    state: "LOGIN" | "REGISTER" | "CODE" | "INVITE",
    e?: string
  ) => void;
  email: string;
  invite?: boolean;
}

export function RegisterForm({
  toggleState,
  email,
  invite = false,
}: RegisterFormProps) {
  const {requestCode} = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<{
    name?: string;
    email?: string;
    password?: string;
    requestId?: undefined | string;
    mobile: number | null;
    username?:string | undefined
  }>({
    name: undefined,
    email: invite ? email : undefined,
    password: undefined,
    requestId: requestCode,
    mobile: null,
    username:undefined
  });

  const isValidState = () => {
    const {name, email, password, mobile,username} = state;
    const isNameValid = name && name.trim().length > 0;
    const isEmailValid = email && email.includes("@");
    const isPasswordValid = password && password.length >= 6;
    const isMobileValid = mobile && mobile.toString().length >= 10;
    return isNameValid && isEmailValid && isPasswordValid && isMobileValid;
  };

  let [error, _seterror] = useState<null | string>(null);
  let [message, _message] = useState<string>("");

  function handleRegistration(e: FormEvent) {
    e.preventDefault();
    setLoading(!loading);
    let isValid = isValidState();
    if (!isValid) {
      _seterror("Please enter valid information");
      setLoading(false);
      return;
    }
    _props
      ._db(service.authentication)
      .query(serviceRoute.register, state, reqType.post)
      .then(result => {
        _message(result.message);
        toggleState("CODE", state.email);
        setLoading(false);
      })
      .catch(response => {
        _seterror(response.data.message);
        setLoading(false);
      });
  }

  function handleUpdate(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    let {name, value} = event.target;
    setState({
      ...state,
      [name]: value,
    });
  }

  useEffect(() => {
    window.setTimeout(() => {
      _seterror(null);
    }, 5000);
  }, [error]);

  return (
    <motion.div
      animate={{x: 0}}
      transition={{type: "tween"}}
      initial={{x: -20}}
      exit={{x: 100}}
      className={"loginFormWrapper"}
    >
      <Snackbar message={message} onClose={() => _message("")} />
      <form style={{width: "80%"}} onSubmit={handleRegistration}>
        <motion.div
            initial={{y: 10}}
            animate={{y: 0}}
            className={"authErrorContainer font-medium font-primary"}
            style={{textAlign: "center"}}
        >
          {error}
        </motion.div>
        <div className={"logincontainer"}>
          <label style={{marginLeft: "4px"}}>Username</label>
          <div className={"inputWrapper-icon"}>
            <Input
                onChange={handleUpdate}
                type={"text"}
                allowToggle={false}
                inputName={"username"}
                value={state.username}
                icon={<></>}
                placeholder={'Username should be unique.'}
            />
          </div>

        </div>
        <div className={"logincontainer"}>
          <label style={{marginLeft: "4px"}}>Name</label>
          <div className={"inputWrapper-icon"}>
            <Input
                onChange={handleUpdate}
                type={"text"}
                allowToggle={false}
                inputName={"name"}
                value={state.name}
                icon={<FaRegUser size={20}/>}
                placeholder={'Emillie watson'}
            />
          </div>
        </div>
          <div className={"logincontainer"}>
            <label style={{marginLeft: "4px"}}>Mobile</label>
            <div className={"inputWrapper-icon"}>
              <Input
                  onChange={handleUpdate}
                  type={"tel"}
                  allowToggle={false}
                  inputName={"mobile"}
                  value={state.mobile?.toString()}
                  icon={<FiPhone size={22}/>}

              />
            </div>
          </div>
          <div className={"logincontainer"}>
            <label style={{marginLeft: "4px"}}>Email</label>
            <div className={"inputWrapper-icon"}>
              <Input
                  disabled={!!(email && invite)}
                  onChange={handleUpdate}
                  type={"email"}
                  allowToggle={false}
                  inputName={"email"}
                  value={state.email}
                  icon={<MdOutlineAlternateEmail size={22}/>}
                  placeholder={'emillie@email.com'}
              />
            </div>
          </div>
          <div className={"logincontainer"}>
            <label>Password</label>
            <div className={"inputWrapper-icon"}>
              <Input
                  disabled={!state.email}
                  onChange={handleUpdate}
                  type={"password"}
                  allowToggle={true}
                  inputName={"password"}
                  value={state.password}
                  icon={<FaRegEye size={22}/>}
              />
            </div>
          </div>
          <div className={"logincontainer flex-center"}>
            <button
                disabled={loading}
                onClick={handleRegistration}
                className={"btn btn-primary w50"}
            >
              {loading ? <Spinner/> : "Register"}
            </button>
          </div>
          <div
              className={"logincontainer flex-right"}
              style={{marginTop: "24px"}}
          >
            <div
                className={"font-primary font-medium font-thick"}

            >
              <p>
                Already part of our community?{" "}
                <span   onClick={() => {
                  toggleState("LOGIN");
                }} className={"color-green"} style={{cursor: "pointer"}}>
                {" "}
                  Login{" "}
              </span>
              </p>
            </div>
          </div>
      </form>
    </motion.div>
);
}
