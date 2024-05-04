import {ChangeEvent, ReactElement, useState} from "react";

interface ICustomInput {
  onChange: (s: ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactElement;
  type: string;
  allowToggle: boolean;
  inputName: string;
  value?: string | number | undefined;
  disabled?: boolean;
  placeholder?: string;
  textColor?:string;
  borderRadius?:string;
  height?:string
}



export function Input(props: ICustomInput) {
  const [state, setState] = useState({isHidden: true});
  function toggleState() {
    if (props.allowToggle && props.type === "password") {
      setState({...state, isHidden: !state.isHidden});
    }
  }
  let styles  = {
    container: {
      height: "2em",
      background: "transparent",
      display: "flex",
      justifyContent: "space-between",
      border:'1px solid whitesmoke',
      borderRadius:"20px",
    },
    iconContainer: {
      width: "20%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
    },
    inputContainer: {
      width: "90%",
      height: "100%",

    },
    inputEle: {
      width: "100%",
      background: "transparent",
      border: "none",
      height: "100%",
      paddingLeft: "20px", color: 'white',borderRadius:'20px',

    },
  };
  let _styles = styles;
  _styles['inputEle'].color = props.textColor ? props.textColor : "white";
  _styles['container'].borderRadius = props.borderRadius ? props.borderRadius : '0px';
  _styles['container'].border= props.textColor ? '1px solid ' + props.textColor : "white";
  _styles['container'].height = props.height ? props.height : '2em'
  return (
    <div style={_styles.container}>
      <div style={_styles.inputContainer}>
        <input
          disabled={props.disabled}
          value={props.value}
          name={props.inputName}
          onChange={props.onChange}
          style={_styles.inputEle}
          type={state.isHidden ? props.type : "text"}
          placeholder={props.placeholder}
          
        />
      </div>
      <div style={_styles.iconContainer} onClick={toggleState}>
        {props.icon}
      </div>
    </div>
  );
}
