import { create } from "zustand";
import { Chatroom } from "../types/apiType";
import { getChatrooms, createChatroom } from "../lib/api/chatroom-api";

type Store = {
  chatroomsMap: Map<string, Chatroom>;
  chatroomsOrder: {
    group: string[];
    private: string[];
    global: string[];
  };
  currentChat: Chatroom;
  privateChatrooms: Chatroom[];
};

type Action = {
  getChatrooms: (user_id: string) => Promise<void>;
  createChatroom: (
    type: string,
    members: string[],
    avatar: string,
    name: string
  ) => Promise<void>;
  setCurrentChat: (chatroom: Chatroom) => void;
};

const useChatroomStore = create<Store & Action>()((set, get) => ({
  chatroomsMap: new Map<string, Chatroom>(),
  chatroomsOrder: {
    group: [],
    private: [],
    global: [],
  },
  currentChat: null,
  privateChatrooms: [],

  setCurrentChat: (chatroom: Chatroom) => set({ currentChat: chatroom }),
  getChatrooms: async (user_id: string) => {
    try {
      const chatrooms = await getChatrooms(user_id);
      const groupChatrooms = chatrooms.filter(
        (chatroom: Chatroom) => chatroom.type === "group"
      );
      const privateChatrooms = chatrooms.filter(
        (chatroom: Chatroom) => chatroom.type === "private"
      );
      const globalChatrooms = chatrooms.filter(
        (chatroom: Chatroom) => chatroom.type === "global"
      );
      set({
        chatroomsMap: new Map(
          chatrooms.map((chatroom: Chatroom) => [chatroom._id, chatroom])
        ),
        chatroomsOrder: {
          group: groupChatrooms.map((chatroom: Chatroom) => chatroom._id),
          private: privateChatrooms.map((chatroom: Chatroom) => chatroom._id),
          global: globalChatrooms.map((chatroom: Chatroom) => chatroom._id),
        },
        currentChat: globalChatrooms[0],
        privateChatrooms: privateChatrooms,
      });
    } catch (error) {
      console.error("取得聊天室失敗:", error);
    }
  },
  createChatroom: async (
    type: string,
    members: string[],
    avatar: string,
    name: string
  ) => {
    try {
      const newChatroom = await createChatroom({
        type,
        members,
        avatar,
        name,
      });
      set({
        chatroomsMap: get().chatroomsMap.set(newChatroom._id, newChatroom),
        chatroomsOrder: {
          ...get().chatroomsOrder,
          [newChatroom.type]: [
            ...get().chatroomsOrder[newChatroom.type],
            newChatroom._id,
          ],
        },
      });
    } catch (error) {
      console.error("建立聊天室失敗:", error);
    }
  },
}));

export default useChatroomStore;
