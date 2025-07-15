import { create } from "zustand";
import { Message } from "../types/apiType";
import {
  getHistoryMessage,
  sendMessage,
  recallMessage,
} from "../lib/api/message-api";
import { DateParser } from "../utils/TimeParser";

type Store = {
  messageMap: Map<string, Message>;
  messageOrder: string[]; // 存儲訊息的 ID 順序
  datedMessages: Record<string, Message[]>; // 存儲按日期分組的訊息
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
  handleReceiveMessage: (message: Message) => void;
  handleRecallMessage: (message_id: string) => void;
  getDatedMessage: (messages: Message[]) => void;
};

const useMessageStore = create<Store & Action>((set, get) => ({
  messageMap: new Map<string, Message>(),
  messageOrder: [],
  datedMessages: {},

  getDatedMessage: (messages: Message[]) => {
    const groupedMessages = messages.reduce((acc, msg) => {
      const dateKey = DateParser(msg.createdAt); // e.g., '2025-06-12'

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(msg);

      return acc;
    }, {});
    set({
      datedMessages: groupedMessages,
    });
  },
  handleReceiveMessage: (message: Message) => {
    const newMessageMap = new Map(get().messageMap);
    newMessageMap.set(message._id, message);
    const newMessageOrder = [...get().messageOrder, message._id];
    set({
      messageMap: newMessageMap,
      messageOrder: newMessageOrder,
    });
    get().getDatedMessage([...get().messageMap.values()]);
  },
  handleRecallMessage: (message_id: string) => {
    const newMessageMap = new Map(get().messageMap);
    newMessageMap.set(message_id, {
      ...get().messageMap.get(message_id),
      isRecalled: true,
    });
    set({
      messageMap: newMessageMap,
    });
    get().getDatedMessage([...get().messageMap.values()]);
  },

  getHistoryMessage: async (chatroom_id: string) => {
    try {
      const messages = await getHistoryMessage(chatroom_id);
      const newMessageMap = new Map(
        messages.map((message: Message) => [message._id, message])
      ) as Map<string, Message>;
      get().getDatedMessage(messages);
      set({
        messageMap: newMessageMap,
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

  recallMessage: async (message_id: string) => {
    try {
      await recallMessage(message_id);
      get().handleRecallMessage(message_id);
    } catch (error) {
      console.error("撤回訊息失敗:", error);
    }
  },
}));

export default useMessageStore;
