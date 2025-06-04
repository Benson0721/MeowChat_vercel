import { axiosInstance } from "./axios-config.ts";

export const getChatrooms = async (user_id: string) => {
  try {
    const chatrooms = await axiosInstance.get(`/api/chatroom/${user_id}`);
    return chatrooms.data;
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    throw error;
  }
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
  try {
    const chatroom = await axiosInstance.post("/api/chatroom", {
      type,
      members,
      avatar,
      name,
    });
    return chatroom.data;
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    throw error;
  }
};
