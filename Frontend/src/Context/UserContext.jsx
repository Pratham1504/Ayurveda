
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // async function loginUser(email, password, navigate) {
  //   setBtnLoading(true);
  //   try {
  //     const { data } = await axios.post(`${server}/api/user/login`, {
  //       email,
  //       password,
  //     });

  //     toast.success(data.message);
  //     localStorage.setItem("token", data.token);
  //     setUser(data.user);
  //     if(data.user.role === 'admin'){
  //       setIsAdmin(true);
  //     }
  //     setIsAuth(true);
  //     setBtnLoading(false);
  //     navigate("/");
  //   } catch (error) {
  //     setBtnLoading(false);
  //     setIsAuth(false);
  //     toast.error(error.response.data.message);
  //   }
  // }

  async function loginUser(loginData, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, loginData);

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      if (data.user.role === 'admin') {
        setIsAdmin(true);
      }
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      toast.error(error?.response?.data?.message || "Login failed");
    }
  }


  async function registerUser(fullName, email, mobileNo, password,  navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/signup`, {
        fullName,
        email,
        password,
        mobileNo
      });

      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      setBtnLoading(false);
      navigate("/verify");
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response.data.message);
    }
  }

  async function verifyOtp(otp, navigate) {
    console.log(typeof otp);
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        activationToken,
      });

      toast.success(data.message);
      navigate("/login");
      localStorage.clear();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      if (data.user.role === 'admin') {
        setIsAdmin(true);
      }
      setIsAuth(true);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  function logoutUser() {
    localStorage.clear();
    toast.success("Logged out successfully");
    // sessionStorage.clear(); // if used
    setIsAuth(false);
    setUser([]);
    setIsAdmin(false);
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setIsAuth,
        isAuth,
        isAdmin,
        setIsAdmin,
        loginUser,
        btnLoading,
        loading,
        registerUser,
        verifyOtp,
        fetchUser,
        logoutUser,
        modalIsOpen,
        setModalIsOpen,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
