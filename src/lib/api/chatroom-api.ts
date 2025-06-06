import { axiosInstance } from "./axios-config.ts";

export const getChatrooms = async (user_id: string) => {
  console.log(user_id);
  const chatrooms = await axiosInstance.get(`/api/chatroom/`, {
    params: {
      user_id,
    },
  });
  console.log(chatrooms.data);
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
