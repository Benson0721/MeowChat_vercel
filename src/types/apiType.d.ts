export interface User {
  _id: string;
  username: string;
  avatar: string;
  status: "online" | "away" | "offline";
}

export interface Chatroom {
  _id: string;
  type: string;
  avatar: string;
  name: string;
  members: string[];
}

export interface Message {
  _id: string;
  chatroom_id: string;
  user: User;
  content: string;
  type: string;
  reply_to: Message | null;
  isRecalled: boolean;
  createdAt: Date;
}

export interface ChatroomMember {
  _id: string;
  chatroom_id: Chatroom;
  user_id: string;
  joined_at: Date;
  last_read_at: Date;
  unread_count: number;
}

export interface ChatroomMemberList {
  [chatroom_id: string]: {
    members: ChatroomMember[];
  };
}
