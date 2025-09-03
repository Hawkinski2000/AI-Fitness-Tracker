import { useState, type ReactNode } from "react";
import { type SignUpData } from "./SignUpContext";
import { SignUpContext } from "./SignUpContext";


export function SignUpProvider({ children }: { children: ReactNode }) {
  const [signUpData, setSignUpData] = useState<SignUpData>({});

  const clearSignUpData = () => setSignUpData({});

  return (
    <SignUpContext.Provider value={{ signUpData, setSignUpData, clearSignUpData }}>
      {children}
    </SignUpContext.Provider>
  );
}
