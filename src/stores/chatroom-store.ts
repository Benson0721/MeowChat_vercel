import { create } from "zustand";
import { Messages } from "../types/apiType";
import { getChatrooms, createChatroom } from "../lib/api/chatroom-api";

type Store = {
  chatroomsMap: Map<string, Messages>;
  chatroomsOrder: {
    public: string[];
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

const useChatroomStore = create<Store & Action>((set, get) => ({
  chatroomsMap: new Map<string, Messages>(),
  chatroomsOrder: {
    public: [],
    private: [],
    global: [],
  },

  getChatrooms: async (user_id: string) => {
    try {
      const chatrooms = await getChatrooms(user_id);
      const publicChatrooms = chatrooms.filter(
        (chatroom: Messages) => chatroom.type === "public"
      );
      const privateChatrooms = chatrooms.filter(
        (chatroom: Messages) => chatroom.type === "private"
      );
      const globalChatrooms = chatrooms.filter(
        (chatroom: Messages) => chatroom.type === "global"
      );
      set({
        chatroomsMap: new Map(
          chatrooms.map((chatroom: Messages) => [chatroom._id, chatroom])
        ),
        chatroomsOrder: {
          public: publicChatrooms.map((chatroom: Messages) => chatroom._id),
          private: privateChatrooms.map((chatroom: Messages) => chatroom._id),
          global: globalChatrooms.map((chatroom: Messages) => chatroom._id),
        },
      });
    } catch (error) {
      console.error("取得歷史訊息失敗:", error);
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
