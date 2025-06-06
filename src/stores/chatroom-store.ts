import { create } from "zustand";
import { Chatrooms } from "../types/apiType";
import { persist } from "zustand/middleware";
import { getChatrooms, createChatroom } from "../lib/api/chatroom-api";

type Store = {
  chatroomsMap: Map<string, Chatrooms>;
  chatroomsOrder: {
    group: string[];
    private: string[];
    global: string[];
  }; // 存儲訊息的 ID 順序
};

type Action = {
  getChatrooms: (user_id: string) => Promise<void>;
  newChatroom: (
    type: string,
    members: string[],
    avatar: string,
    name: string
  ) => Promise<void>;
};

const useChatroomStore = create<Store & Action>()((set, get) => ({
  chatroomsMap: new Map<string, Chatrooms>(),
  chatroomsOrder: {
    group: [],
    private: [],
    global: [],
  },

  getChatrooms: async (user_id: string) => {
    try {
      const chatrooms = await getChatrooms(user_id);
      const groupChatrooms = chatrooms.filter(
        (chatroom: Chatrooms) => chatroom.type === "group"
      );
      const privateChatrooms = chatrooms.filter(
        (chatroom: Chatrooms) => chatroom.type === "private"
      );
      const globalChatrooms = chatrooms.filter(
        (chatroom: Chatrooms) => chatroom.type === "global"
      );
      set({
        chatroomsMap: new Map(
          chatrooms.map((chatroom: Chatrooms) => [chatroom._id, chatroom])
        ),
        chatroomsOrder: {
          group: groupChatrooms.map((chatroom: Chatrooms) => chatroom._id),
          private: privateChatrooms.map((chatroom: Chatrooms) => chatroom._id),
          global: globalChatrooms.map((chatroom: Chatrooms) => chatroom._id),
        },
      });
    } catch (error) {
      console.error("取得聊天室失敗:", error);
    }
  },
  newChatroom: async (type, members, avatar, name) => {
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
