import { axiosInstance } from "./axios-config";

export const getHistoryMessage = async (chatroom_id: string) => {
  const messages = await axiosInstance.get(`/api/message/${chatroom_id}`);
  return messages.data;
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
  const message = await axiosInstance.post("/api/message", {
    chatroom_id,
    user_id,
    content,
    type,
    reply_to,
  });
  return message.data;
};

export const recallMessage = async (message_id: string) => {
  const message = await axiosInstance.patch(`/api/message/${message_id}`, {
    isRecalled: true,
  });
  return message.data;
};

export const getReadCount = async (message_id: string) => {
  const res = await axiosInstance.get(`/api/message/readcount`, {
    params: {
      message_id,
    },
  });
  return res.data;
};
