"use client";

import {
  ReactNode,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { getCookie } from "cookies-next";
import axios from "axios";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  phoneNumber: string;
  email: string;
}

interface State {
  loading: boolean;
  error: string | null;
  data: User | null;
}

interface AuthState extends State {
  setAuthState: Dispatch<SetStateAction<State>>;
}

export const AuthenticationContext = createContext<AuthState>({
  loading: false,
  data: null,
  error: null,
  setAuthState: () => {},
});

export default function AuthContext({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<State>({
    loading: false,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });

    try {
      const jwt = getCookie("jwt");

      if (!jwt) {
        setAuthState({
          data: null,
          error: null,
          loading: false,
        });
      } else {
        const response = await axios.get("http://localhost:3000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        console.log(response)

        axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`

        setAuthState({
          data: response.data,
          error: null,
          loading: false,
        });
      }
    } catch (error: any) {
      console.log(error);
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        ...authState,
        setAuthState,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
