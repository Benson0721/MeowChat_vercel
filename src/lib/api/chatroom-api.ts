import { axiosInstance } from "./axios-config.ts";

export const getChatrooms = async (user_id: string) => {
  const chatrooms = await axiosInstance.get(`/api/chatroom`, {
    params: {
      user_id,
    },
  });
  return chatrooms.data;
};

export const createChatroom = async ({
  type,
  members,
  avatar,
  name,
}: {
  type: string;
  members: string[];
  avatar: string;
  name: string;
}) => {
  const chatroom = await axiosInstance.post("/api/chatroom", {
    type,
    members,
    avatar,
    name,
  });
  return chatroom.data;
};

export const inviteUser = async (chatroom_id: string, user_id: string) => {
  const chatroom = await axiosInstance.patch("/api/chatroom", {
    chatroom_id,
    user_id,
  });
  return chatroom.data;
};

export const getOneChatroom = async (chatroom_id: string) => {
  const chatroom = await axiosInstance.get(`/api/chatroom/${chatroom_id}`);
  return chatroom.data;
};

/*export const getReadCount = async (message_id: string) => {
  const res = await axiosInstance.get(`/api/message/readcount`, {
    params: {
      message_id,
    },
  });
  return res.data;
};*/
