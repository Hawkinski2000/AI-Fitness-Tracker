import { createContext } from "react";


export interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
