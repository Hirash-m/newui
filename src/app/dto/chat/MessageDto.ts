// src/app/dto/chat/MessageDto.ts

export interface ChatListItem {
  userId: number;
  fullName: string;           // حتماً اینو داشته باش!
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
  lastSeen?: Date | null;
}

export interface MessageDto {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  type: 'Text' | 'Image' | 'File';
  fileUrl?: string;
  sentAt: Date;
  seenAt?: Date;
  isMine?: boolean;
}

export interface SendMessageDto {
  receiverId: number;
  content?: string;
  file?: File;
  type: 'Text' | 'Image' | 'File';
}

export interface ChatListItem {
  userId: number;
  fullName: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
}