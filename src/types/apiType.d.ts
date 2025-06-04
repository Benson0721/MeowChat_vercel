export interface User {
  _id: string;
  username: string;
  avatar: string;
  status: string;
}

export interface Chatrooms {
  _id: string;
  type: string;
  avatar: string;
  name: string;
  members: string[];
}

export interface Messages {
  _id: string;
  chatroom_id: string;
  user_id: string;
  content: string;
  type: string;
  reply_to: string | null;
  isRecalled: boolean;
  createdAt: Date;
}

export interface ChatroomMember {
  _id: string;
  chatroom_id: string;
  user_id: string;
  joined_at: Date;
  last_read_at: Date;
}
