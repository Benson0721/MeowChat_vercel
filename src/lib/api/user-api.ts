import { User } from "../../types/apiType";
import { axiosInstance } from "./axios-config";

export const getOtherUsers = async (user_id: string): Promise<User[]> => {
  try {
    const res = await axiosInstance.get(`/api/user`, {
      params: {
        user_id,
      },
    });
    return res.data;
  } catch (error) {
    console.error("取得其他使用者失敗:", error);
    throw error;
  }
};

export const editUser = async (
  _id: string,
  username: string,
  avatar: string
): Promise<User> => {
  try {
    const res = await axiosInstance.put(`/api/user/${_id}`, {
      username,
      avatar,
    });
    return res.data;
  } catch (error) {
    console.error("更新使用者失敗:", error);
    throw error;
  }
};

export const changeStatus = async (
  _id: string,
  status: string
): Promise<User> => {
  try {
    const res = await axiosInstance.patch(`/api/user/${_id}`, {
      status,
    });
    return res.data;
  } catch (error) {
    console.error("更新使用者狀態失敗:", error);
    throw error;
  }
};

export const register = async (
  email: string,
  password: string,
  username: string
): Promise<User> => {
  try {
    const res = await axiosInstance.post("/api/user/register", {
      email,
      password,
      username,
    });
    return res.data;
  } catch (error) {
    console.error("註冊失敗:", error);
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const res = await axiosInstance.post("/api/user/login", {
      email,
      password,
    });
    return res.data;
  } catch (error) {
    console.error("登入失敗:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post("/api/user/logout");
  } catch (error) {
    console.error("登出失敗:", error);
    throw error;
  }
};
