import { create } from "zustand";
import localforage from "localforage";
import { User } from "../types/apiType";
import {
  getOtherUsers,
  editUser,
  logout,
  login,
  register,
  changeStatus,
} from "../lib/api/user-api";

type Store = {
  user: User;
  otherUsersMap: Map<string, User>;
  otherUsersOrder: string[];
  isLogin: boolean;
};

type Action = {
  getOtherUsers: (user_id: string) => Promise<void>;
  editUser: (user: User) => Promise<void>;
  changeStatus: (user: User, status: string) => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
};

const useUserStore = create<Store & Action>((set) => ({
  user: {
    _id: "",
    username: "",
    avatar: "",
    status: "offline",
  },
  otherUsersMap: new Map<string, User>(),
  otherUsersOrder: [],
  isLogin: false,

  getOtherUsers: async (user_id: string) => {
    try {
      const users = await getOtherUsers(user_id);
      const OnlineUsers = users.filter(
        (user: User) => user.status !== "offline"
      );
      const OfflineUsers = users.filter(
        (user: User) => user.status === "offline"
      );
      const sortedUsers = [...OnlineUsers, ...OfflineUsers];
      set({
        otherUsersMap: new Map(
          sortedUsers.map((user: User) => [user._id, user])
        ),
        otherUsersOrder: sortedUsers.map((user: User) => user._id),
      });
    } catch (error) {
      console.error("取得其他使用者失敗:", error);
    }
  },
  changeStatus: async (user: User, status: string) => {
    try {
      const updatedUser = await changeStatus(user._id, status);
      set({ user: updatedUser });
    } catch (error) {
      console.error("更新使用者狀態失敗:", error);
    }
  },
  editUser: async (user: User) => {
    try {
      const updatedUser = await editUser(user._id, user.username, user.avatar);
      set({ user: updatedUser });
    } catch (error) {
      console.error("更新使用者失敗:", error);
    }
  },
  logout: async () => {
    try {
      await logout();
      set({
        user: { _id: "", username: "", avatar: "", status: "offline" },
        isLogin: false,
      });
      await localforage.removeItem("user");
    } catch (error) {
      console.error("登出失敗:", error);
    }
  },
  login: async (email: string, password: string) => {
    try {
      const user = await login(email, password);
      set({ user, isLogin: true });
      await localforage.setItem("user", user);
    } catch (error) {
      console.error("登入失敗:", error);
    }
  },
  register: async (email: string, password: string, username: string) => {
    try {
      const user = await register(email, password, username);
      set({ user, isLogin: true });
      await localforage.setItem("user", user);
    } catch (error) {
      console.error("註冊失敗:", error);
    }
  },
}));

export default useUserStore;
