import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseStyle = {
  background: "#2a2d42",           
  color: "#ffffff",                   
  border: "1px solid #98878F",         
  borderRadius: "14px",              
  boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
  fontSize: "15px",
  fontFamily: "'Poppins', sans-serif",
  padding: "12px 16px",
  letterSpacing: "0.3px",
};

export const notifySuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    style: {
      ...baseStyle,
      borderLeft: "5px solid #38d39f", 
    },
  });
};

export const notifyError = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    style: {
      ...baseStyle,
      borderLeft: "5px solid #e74c3c", 
    },
  });
};

export const notifyInfo = (message: string) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    style: {
      ...baseStyle,
      borderLeft: "5px solid #3498db", 
    },
  });
};
