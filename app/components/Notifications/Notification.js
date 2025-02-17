import { toast } from "react-toastify";
import "./Notification.css"

export const CreateSuccessNotification = (msg) => {
  toast.success(msg || `Success`, {
    className: 'toast-error-container toast-error-container-after',
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const CreateErrorNotification = (msg, timer) => {
  toast.error(msg || `Something went wrong! Please try again.`, {
    className: 'toast-error-container toast-error-container-after',
    position: "bottom-right",
    autoClose: timer ? timer : 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
};