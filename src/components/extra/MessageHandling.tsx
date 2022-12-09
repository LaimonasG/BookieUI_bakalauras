import React from "react";
import { toast } from "react-toastify";
import ToastifyModal from "./ToastifyModal/index";

type Props={
  method:string,
  errorMessage:string
}
const messageHandling = (props:Props) => {
  toast.dismiss();
  let message = "Error Message";

  if (props.errorMessage) {
    message = props.errorMessage;
  }

  const toastifyModal = (
    <ToastifyModal
      message={message}
    />
  );
  switch (props.method) {
    case "warn":
      toast.warn(toastifyModal);
      break;
    case "success":
      toast.success(toastifyModal);
      break;
    case "error":
      toast.error(toastifyModal);
      break;
    case "info":
      toast.info(toastifyModal);
      break;
    default:
      toast.dark(toastifyModal);
      break;
  }
};

export {
  messageHandling,
};