import { axiosInstance } from "./axios-config";
export const getSticker = async () => {
  const res = await axiosInstance.get(`/api/sticker`);
  return res.data;
};
