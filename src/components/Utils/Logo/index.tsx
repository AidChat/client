import React from "react";
import logo from "./../../../assets/png/icon.png";
import "./style.css";
export function Logo(props:{src?:string}) {
  return (
    <div className={"logoWrapper"}>
      <img src={props.src || logo}  alt={'logo'}/>
    </div>
  );
}
