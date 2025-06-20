import { axiosInstance } from "./axios-config";
import { ChatroomMemberList } from "../../types/apiType";

export const getChatroomMember = async (user_id: string) => {
  const res = await axiosInstance.get<ChatroomMemberList>(`/api/member`, {
    params: {
      user_id,
    },
  });
  return res.data;
};

export const updateLastReadAt = async (
  user_id: string,
  chatroom_id: string
) => {
  try {
    const res = await axiosInstance.patch(`/api/member`, {
      user_id,
      chatroom_id,
      last_read_at: Date.now(),
    });
    return res.data;
  } catch (err) {
    console.error("更新 last_read_at 時發生錯誤:", err);
    return null;
  }
};

export const updateUnreadCount = async (
  user_id: string,
  chatroom_id: string
) => {
  try {
    const res = await axiosInstance.put("/api/member", {
      user_id,
      chatroom_id,
    });

    return res.data;
  } catch (err) {
    console.error("更新 unread 時發生錯誤:", err);
    return null;
  }
};

export const addChatroomMember = async (
  user_id: string,
  chatroom_id: string
) => {
  try {
    const res = await axiosInstance.post("/api/member", {
      user_id,
      chatroom_id,
    });

    return res.data;
  } catch (err) {
    console.error("添加聊天室成員時發生錯誤:", err);
    return null;
  }
};
