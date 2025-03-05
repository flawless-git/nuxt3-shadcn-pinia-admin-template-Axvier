export type User = {
  id: string;
  email: string;
  username: string;
  role: "ADMIN" | "USER";
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
  password?: string;
};

export interface Post {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    email: string;
  };
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type Role = "ADMIN" | "USER";
