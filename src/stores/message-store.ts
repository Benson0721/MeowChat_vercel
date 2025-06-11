import { create } from "zustand";
import { Message } from "../types/apiType";
import {
  getHistoryMessage,
  getReadCount,
  sendMessage,
  recallMessage,
} from "../lib/api/message-api";
import { User } from "../types/apiType";

type Store = {
  messageMap: Map<string, Message>;
  messageOrder: string[]; // 存儲訊息的 ID 順序
  readCount: number;
};

type Action = {
  getHistoryMessage: (chatroom_id: string) => Promise<void>;
  sendMessage: (
    chatroom_id: string,
    user: string,
    content: string,
    type: string,
    reply_to?: string
  ) => Promise<Message>;
  recallMessage: (message_id: string) => Promise<void>;
  getReadCount: (message_id: string) => Promise<void>;
  handleReceiveMessage: (message: Message) => void;
};

const useMessageStore = create<Store & Action>((set, get) => ({
  messageMap: new Map<string, Message>(),
  messageOrder: [],
  readCount: 0,

  handleReceiveMessage: (message: Message) => {
    const newMessageMap = new Map(get().messageMap);
    newMessageMap.set(message._id, message);
    const newMessageOrder = [...get().messageOrder, message._id];
    set({
      messageMap: newMessageMap,
      messageOrder: newMessageOrder,
    });
  },

  getHistoryMessage: async (chatroom_id: string) => {
    try {
      const messages = await getHistoryMessage(chatroom_id);
      set({
        messageMap: new Map(
          messages.map((message: Message) => [message._id, message])
        ),
        messageOrder: messages.map((message: Message) => message._id),
      });
    } catch (error) {
      console.error("取得歷史訊息失敗:", error);
    }
  },
  sendMessage: async (chatroom_id, user_id, content, type, reply_to) => {
    try {
      const newMessage = await sendMessage({
        chatroom_id,
        user_id,
        content,
        type,
        reply_to,
      });
      get().handleReceiveMessage(newMessage);
      return newMessage;
    } catch (error) {
      console.error("發送訊息失敗:", error);
    }
  },
  getReadCount: async (message_id: string) => {
    try {
      const readCount = await getReadCount(message_id);
      set({ readCount });
    } catch (error) {
      console.error("取得已讀數失敗:", error);
    }
  },
  recallMessage: async (message_id: string) => {
    try {
      const updatedMessage = await recallMessage(message_id);
      set({
        messageMap: get().messageMap.set(updatedMessage._id, updatedMessage),
        messageOrder: get().messageOrder.map((id) => {
          if (id === message_id) {
            return updatedMessage._id;
          }
          return id;
        }),
      });
    } catch (error) {
      console.error("撤回訊息失敗:", error);
    }
  },
}));

export default useMessageStore;
