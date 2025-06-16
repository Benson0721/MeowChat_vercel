import { create } from "zustand";
import { ChatroomMember, Message } from "../types/apiType";
import {
  getChatroomMember,
  updateLastReadAt,
  updateUnreadCount,
} from "../lib/api/chatroom-member-api";

type Store = {
  memberMap: Map<string, ChatroomMember[]>;
  userMemberMap: Map<string, ChatroomMember>;
  otherMemberMap: Map<string, ChatroomMember[]>;
  readCount: Record<string, number>;
};

type Action = {
  refreshMaps: (
    memberMap: Map<string, ChatroomMember[]>,
    user_id: string
  ) => {
    userMemberMap: Map<string, ChatroomMember>;
    otherMemberMap: Map<string, ChatroomMember[]>;
  };
  getChatroomMember: (user_id: string) => Promise<void>;
  updateLastReadAt: (user_id: string, chatroom_id: string) => Promise<void>;
  updateUnreadCount: (user_id: string, chatroom_id: string) => Promise<void>;
  updateReadCount: (message: Message[], chatroom_id: string) => Promise<void>;
};

const useChatroomMemberStore = create<Store & Action>()((set, get) => ({
  memberMap: new Map<string, ChatroomMember[]>(),
  userMemberMap: new Map<string, ChatroomMember>(),
  otherMemberMap: new Map<string, ChatroomMember[]>(),
  readCount: {},
  refreshMaps: (memberMap: Map<string, ChatroomMember[]>, user_id: string) => {
    const userMemberMap = new Map<string, ChatroomMember>();
    const otherMemberMap = new Map<string, ChatroomMember[]>();

    for (const [chatroom_id, members] of memberMap.entries()) {
      const me = members?.find((m) => m.user_id === user_id);
      const others = members?.filter((m) => m.user_id !== user_id);
      if (me) userMemberMap.set(chatroom_id, me);
      otherMemberMap.set(chatroom_id, others);
    }

    return { userMemberMap, otherMemberMap };
  },
  getChatroomMember: async (user_id: string) => {
    try {
      const chatroomMemberList = await getChatroomMember(user_id);
      console.log("chatroomMemberList: ", chatroomMemberList);
      const memberMap = new Map<string, ChatroomMember[]>();

      Object.entries(chatroomMemberList).forEach(([chatroom_id, value]) => {
        memberMap.set(chatroom_id, value.members);
      });
      console.log("memberMap: ", memberMap);
      const { userMemberMap, otherMemberMap } = get().refreshMaps(
        memberMap,
        user_id
      );
      set({
        memberMap: memberMap,
        userMemberMap: userMemberMap,
        otherMemberMap: otherMemberMap,
      });
    } catch (error) {
      console.error("取得聊天室失敗:", error);
    }
  },
  updateLastReadAt: async (user_id: string, chatroom_id: string) => {
    try {
      const chatroomMember = await updateLastReadAt(user_id, chatroom_id);

      const memberMapArray = get().memberMap.get(chatroom_id);

      memberMapArray?.forEach((member) => {
        if (member.user_id === user_id) {
          member.last_read_at = chatroomMember.last_read_at;
        }
      });

      const newMap = new Map(get().memberMap);
      newMap.set(chatroom_id, memberMapArray);
      console.log("newMap: ", newMap);
      const { userMemberMap, otherMemberMap } = get().refreshMaps(
        newMap,
        user_id
      );
      console.log("userMemberMap: ", userMemberMap);
      console.log("otherMemberMap: ", otherMemberMap);
      set({
        memberMap: newMap,
        userMemberMap: userMemberMap,
        otherMemberMap: otherMemberMap,
      });
    } catch (error) {
      console.error("更新聊天室失敗:", error);
    }
  },
  updateUnreadCount: async (user_id: string, chatroom_id: string) => {
    try {
      const chatroomMember = await updateUnreadCount(user_id, chatroom_id);
      const memberMapArray = get().memberMap.get(chatroom_id);

      memberMapArray?.forEach((member) => {
        if (member.user_id === user_id) {
          member.unread_count = chatroomMember.unread_count;
        }
      });
      const newMap = new Map(get().memberMap);
      newMap.set(chatroom_id, memberMapArray);
      const { userMemberMap, otherMemberMap } = get().refreshMaps(
        newMap,
        user_id
      );
      set({
        memberMap: newMap,
        userMemberMap: userMemberMap,
        otherMemberMap: otherMemberMap,
      });
    } catch (error) {
      console.error("更新聊天室失敗:", error);
    }
  },
  updateReadCount: async (messages: Message[], chatroom_id: string) => {
    try {
      console.log("update read count: ", chatroom_id);
      console.log("messages: ", messages);
      const memberMapArray = get().memberMap.get(chatroom_id);
      console.log("memberMapArray: ", memberMapArray);

      const newMap = new Map<string, number>();
      messages.forEach((message) => {
        if (!Array.isArray(memberMapArray)) return;
        const readMember = memberMapArray.filter((member) => {
          console.log("last read at: ", new Date(member.last_read_at));
          console.log("message created at: ", new Date(message.createdAt));
          return (
            member.user_id !== message.user._id &&
            new Date(member.last_read_at).getTime() >
              new Date(message.createdAt).getTime()
          );
        });
        newMap.set(message._id, readMember.length);
      });
      const readCount = Object.fromEntries(newMap);
      set({
        readCount: readCount,
      });
      console.log("readCount: ", get().readCount);
    } catch (error) {
      console.error("更新聊天室失敗:", error);
    }
  },
}));

export default useChatroomMemberStore;
