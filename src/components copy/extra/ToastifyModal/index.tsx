import React from "react";

type Props = {
  message : string,
}

const toastModal = (props:Props) => (
  <>
    <div className="white-space:nowrap"><img src="/img/happy.png" width="50px" height="50px" /> | <span> {props.message} </span></div>

  </>
);


export default toastModal;