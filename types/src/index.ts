export interface Message {
  id: string;
  value: string;
  timestamp: number;
  from: User["userId"];
}

export interface User {
  userId: string;
  username: string;
  joinedAt: number;
  disconnected?: true;
}

export interface UserJoined extends User {
  event: "join";
}

export interface UserLeft extends Pick<User, "userId"> {
  event: "left";
}

export interface MessageSent extends Message {
  event: "message";
}

export interface MessageReceived extends Message {
  event: "message";
}

export type IncomingData = UserJoined | UserLeft | MessageReceived;
