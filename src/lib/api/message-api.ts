import { axiosInstance } from "./axios-config";

export const getHistoryMessage = async (chatroom_id: string) => {
  try {
    const messages = await axiosInstance.get(`/api/message/${chatroom_id}`);
    return messages.data;
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    throw error;
  }
};

export const sendMessage = async ({
  chatroom_id,
  user_id,
  content,
  type,
  reply_to,
}: {
  chatroom_id: string;
  user_id: string;
  content: string;
  type: string;
  reply_to?: string;
}) => {
  try {
    const message = await axiosInstance.post("/api/message", {
      chatroom_id,
      user_id,
      content,
      type,
      reply_to,
    });
    return message.data;
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    throw error;
  }
};

export const recallMessage = async (message_id: string) => {
  try {
    const message = await axiosInstance.patch(`/api/message/${message_id}`, {
      isRecalled: true,
    });
    return message.data;
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    throw error;
  }
};

export const getReadCount = async (message_id: string) => {
  try {
    const res = await axiosInstance.get(`/api/message/readcount`, {
      params: {
        message_id,
      },
    });
    return res.data;
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    throw error;
  }
};
