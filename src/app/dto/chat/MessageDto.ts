// src/app/dto/chat/MessageDto.ts
export interface MessageDto {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    fileUrl?: string;
    type: 'Text' | 'Image' | 'File';
    sentAt: Date;
    deliveredAt?: Date;
    seenAt?: Date;
    isMine?: boolean; // برای UI
    senderName?: string; // برای UI
  }
  
  export interface SendMessageDto {
    receiverId: number;
    content: string;
    file?: File;
    type: 'Text' | 'Image' | 'File';
  }
  
  export interface ChatListItem {
    userId: number;
    userName: string;
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount: number;
    isOnline: boolean;
    lastSeen?: Date;
  }