import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/apiType";
import {
  getOtherUsers,
  editUser,
  logout,
  login,
  signup,
  changeStatus,
  checkAuth,
} from "../lib/api/user-api";

type Store = {
  user: User;
  otherUsersMap: Map<string, User>;
  otherUsersOrder: string[];
  isLogin: boolean;
};

type Action = {
  setOtherUsers: (users: Map<string, User>) => void;
  checkAuth: () => void;
  getOtherUsers: (user_id: string) => Promise<void>;
  editUser: (user: User) => Promise<void>;
  changeStatus: (user: User, status: string) => Promise<void>;
  logoutHandler: () => Promise<void>;
  loginHandler: (email: string, password: string) => Promise<User>;
  signupHandler: (
    email: string,
    password: string,
    username: string
  ) => Promise<User>;
};

const useUserStore = create<Store & Action>()(
  persist(
    (set, get) => ({
      user: {
        _id: "",
        username: "",
        avatar: "",
        status: "offline",
      },
      otherUsersMap: new Map<string, User>(),
      otherUsersOrder: [],
      isLogin: false,

      checkAuth: async () => {
        const res = await checkAuth();
        if (res.isAuthenticated) {
          set({ isLogin: true });
          set({ user: res.user });
        } else {
          set({ isLogin: false });
          set({
            user: { _id: "", username: "", avatar: "", status: "offline" },
          });
        }
      },

      setOtherUsers: (users: Map<string, User>) => {
        const OnlineUsers = Array.from(users.values()).filter(
          (user) => user.status !== "offline"
        );
        const OfflineUsers = Array.from(users.values()).filter(
          (user) => user.status === "offline"
        );
        const sortedUsers = [...OnlineUsers, ...OfflineUsers];
        set({
          otherUsersMap: new Map(sortedUsers.map((user) => [user._id, user])),
          otherUsersOrder: sortedUsers.map((user) => user._id),
        });
      },
      getOtherUsers: async (user_id: string) => {
        try {
          const users = await getOtherUsers(user_id);
          const OnlineUsers = users.filter((user) => user.status !== "offline");
          const OfflineUsers = users.filter(
            (user) => user.status === "offline"
          );
          const sortedUsers = [...OnlineUsers, ...OfflineUsers];

          set({
            otherUsersMap: new Map(sortedUsers.map((user) => [user._id, user])),
            otherUsersOrder: sortedUsers.map((user) => user._id),
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
          const updatedUser = await editUser(
            user._id,
            user.username,
            user.avatar
          );
          set({ user: updatedUser });
        } catch (error) {
          console.error("更新使用者失敗:", error);
        }
      },

      logoutHandler: async () => {
        try {
          await logout(get().user._id);
          set({
            user: { _id: "", username: "", avatar: "", status: "offline" },
            isLogin: false,
          });
        } catch (error) {
          console.error("登出失敗:", error);
        }
      },

      loginHandler: async (email: string, password: string) => {
        const user = await login(email, password);
        set({ user, isLogin: true });
        return user;
      },

      signupHandler: async (
        email: string,
        password: string,
        username: string
      ) => {
        const user = await signup(email, password, username);
        set({ user, isLogin: true });
        return user;
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        isLogin: state.isLogin,
      }),
    }
  )
);

export default useUserStore;
