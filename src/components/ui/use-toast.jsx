import { createContext, useContext, useState } from "react";
import { ToastContainer, toast as toastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, status, duration, isClosable, toastId }) => {
    const id = toastify[status](
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>,
      {
        autoClose: duration,
        closeButton: isClosable,
        toastId: toastId,
      }
    );
    setToasts([...toasts, { id, title, description, status }]);
    return id;
  };

  const dismiss = (id) => {
    toastify.dismiss(id);
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};