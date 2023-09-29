import axios from "axios";
import useAuthContext from "./useAuthContext";
import {deleteCookie} from "cookies-next"

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phoneNumber: number;
  password: string;
}

const useAuth = () => {
  const { loading, data, error, setAuthState } = useAuthContext();

  const signin = async (data: SignInData) => {
    setAuthState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      data: null,
    }));
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signin", {
        email: data.email,
        password: data.password,
      });
     setAuthState((prev) => ({
       ...prev,
       loading: false,
       error: null,
       data: res?.data
     }));
    } catch (error: any) {
      console.log(error);
     setAuthState((prev) => ({
       ...prev,
       loading: false,
       error: error?.response?.data?.message,
       data: null,
     }));
    }
  };

  const signup = async (data: SignUpData) => {
     setAuthState((prev) => ({
       ...prev,
       loading: true,
       error: null,
       data: null,
     }));
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        city: data.city,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: null,
        data:  res?.data
      }));
    } catch (error: any) {
      console.log(error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error?.response?.data?.message,
        data: null,
      }));
    }
  };

  const logout = () => {
    deleteCookie('jwt')
    setAuthState((prev) => ({
      ...prev,
      loading: false,
      error: null,
      data: null,
    }));
  }

  return {
    signin,
    signup,
    logout
  };
};

export default useAuth;
