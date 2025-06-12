import dayjs from "dayjs";

export const DateParser = (date: Date) => {
  const formatDate = dayjs(date).format("YYYY-MM-DD");
  return formatDate;
};

export const timeParser = (date: Date) => {
  const formatTime = dayjs(date).format("HH:mm");
  return formatTime;
};
