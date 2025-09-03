import { useContext } from "react";
import { type SignUpContextType } from "./SignUpContext";
import { SignUpContext } from "./SignUpContext";


export const useSignUp = (): SignUpContextType => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("useSignUp must be used inside SignUpProvider");
  }
  return context;
};
