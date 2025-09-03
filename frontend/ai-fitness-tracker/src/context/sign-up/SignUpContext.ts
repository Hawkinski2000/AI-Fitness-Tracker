import { createContext } from "react";


export type SignUpData = {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  sex?: string;
  age?: number;
  height?: number;
  weight?: number;
  goal?: string;
};

export type SignUpContextType = {
  signUpData: SignUpData;
  setSignUpData: React.Dispatch<React.SetStateAction<SignUpData>>;
  clearSignUpData: () => void;
};

export const SignUpContext = createContext<SignUpContextType | undefined>(undefined);
