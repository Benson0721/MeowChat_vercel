import { create } from "zustand";
import { Chatroom } from "../types/apiType";
import {
  getChatrooms,
  createChatroom,
  inviteUser,
  getOneChatroom,
} from "../lib/api/chatroom-api";
import useChatroomMemberStore from "./chatroom-member-store";
import useUserStore from "./user-store";

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
  getOneChatroom: (chatroom_id: string) => Promise<void>;
  createChatroom: (
    type: string,
    members: string[],
    avatar: string,
    name: string
  ) => Promise<void>;
  setCurrentChat: (chatroom: Chatroom) => void;
  inviteUser: (user_id: string, chatroom_id: string) => Promise<void>;
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
  getOneChatroom: async (chatroom_id: string) => {
    try {
      const chatroom = await getOneChatroom(chatroom_id);
      const newMap = new Map(get().chatroomsMap);
      newMap.set(chatroom._id, chatroom);
      set({
        chatroomsMap: newMap,
      });
      if (get().currentChat._id === chatroom_id) {
        get().setCurrentChat(chatroom);
      }
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
      const existing = get().privateChatrooms.find((chatroom) =>
        chatroom.members.includes(
          members.find((member) => member !== useUserStore.getState().user._id)
        )
      );
      if (existing) return;

      const newChatroom = await createChatroom({
        type,
        members,
        avatar,
        name,
      });
      const newMap = new Map(get().chatroomsMap);
      newMap.set(newChatroom._id, newChatroom);
      const newOrder = {
        ...get().chatroomsOrder,
        [newChatroom.type]: [
          ...get().chatroomsOrder[newChatroom.type],
          newChatroom._id,
        ],
      };
      set({
        chatroomsMap: newMap,
        chatroomsOrder: newOrder,
        currentChat: newChatroom,
        privateChatrooms: newChatroom.type === "private" ? [...get().privateChatrooms, newChatroom] : get().privateChatrooms,
      });

      useChatroomMemberStore
        .getState()
        .getChatroomMember(useUserStore.getState().user._id);
    } catch (error) {
      console.error("建立聊天室失敗:", error);
    }
  },
  inviteUser: async (user_id: string, chatroom_id: string) => {
    try {
      const updatedChatroom = await inviteUser(chatroom_id, user_id);
      const newMap = new Map(get().chatroomsMap);
      newMap.set(updatedChatroom._id, updatedChatroom);
      set({
        chatroomsMap: newMap,
      });
      if (!get().chatroomsOrder.group.includes(updatedChatroom._id)) {
        const newOrder = {
          ...get().chatroomsOrder,
          group: [...get().chatroomsOrder.group, updatedChatroom._id],
        };
        set({
          chatroomsOrder: newOrder,
        });
      }
    } catch (error) {
      console.error("建立聊天室失敗:", error);
    }
  },
}));

export default useChatroomStore;
