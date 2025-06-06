import { User } from "../../types/apiType";
import { axiosInstance } from "./axios-config";

export const getOtherUsers = async (user_id: string): Promise<User[]> => {
  const res = await axiosInstance.get(`/api/user`, {
    params: {
      user_id,
    },
  });
  return res.data;
};

export const editUser = async (
  _id: string,
  username: string,
  avatar: string
): Promise<User> => {
  const res = await axiosInstance.put(`/api/user/${_id}`, {
    username,
    avatar,
  });
  return res.data;
};

export const changeStatus = async (
  _id: string,
  status: string
): Promise<User> => {
  const res = await axiosInstance.patch(`/api/user/${_id}`, {
    status,
  });
  return res.data;
};

export const signup = async (
  email: string,
  password: string,
  username: string
): Promise<User> => {
  const res = await axiosInstance.post("/api/user/signup", {
    email,
    password,
    username,
  });
  return res.data;
};

export const login = async (email: string, password: string): Promise<User> => {
  console.log("前端")
  const res = await axiosInstance.post("/api/user/login", {
    email,
    password,
  });
  return res.data;
};

export const logout = async (): Promise<void> => {
  const res = await axiosInstance.post("/api/user/logout");
  return res.data;
};
