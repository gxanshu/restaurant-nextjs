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
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signin", {
        email: data.email,
        password: data.password,
      });
      setAuthState({
        data: res.data,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      console.log(error);
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };
  const signup = async (data: SignUpData) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        city: data.city,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });
      setAuthState({
        data: res.data,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      console.log(error);
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  const logout = () => {
    deleteCookie('jwt')
    setAuthState({
      data: null,
      error: null,
      loading: false,
    });
  }

  return {
    signin,
    signup,
    logout
  };
};

export default useAuth;
