import React from "react";
import {Panel} from "../../components/Panel";
import './main.page.css'
export const Main = () => {
  return (
    <div className={'main-container-wrapper'}
    onContextMenu={(event)=>{
        event.preventDefault();
    }}
    >
      <div className={'main-container'}>
      <Panel />
    </div>
    </div>
  );
};
