// src/app/views/chat/chat/chat.component.ts

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from 'src/app/services/chat/chat.service';
import { AuthService } from 'src/app/services/auth/login/auth.service';
import { ToastService } from 'src/app/services/utilities/toast.service';
import { ChatListItem, MessageDto } from 'src/app/dto/chat/MessageDto';
import { Subscription } from 'rxjs';

import {
  CardComponent, CardHeaderComponent, CardBodyComponent,
  CardFooterComponent, ColComponent, RowComponent,
  BadgeComponent, ButtonDirective
} from '@coreui/angular';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,

    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    BadgeComponent,
    ButtonDirective
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatBody') chatBody!: ElementRef<HTMLDivElement>;

  messages: MessageDto[] = [];
  chatList: ChatListItem[] = [];
  selectedUser: ChatListItem | null = null;
  newMessage: string = '';
  selectedFile: File | null = null;
  messageType: 'Text' | 'Image' | 'File' = 'Text';
  searchText: string = '';
  currentUserId = this.auth.getUserId();

  private subscriptions = new Subscription();

  constructor(
    private chatService: ChatService,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadChatList();

    // دریافت پیام جدید از SignalR
    this.subscriptions.add(
      this.chatService.messageReceived.subscribe((msg: MessageDto) => {
        const isCurrentChat = this.selectedUser &&
          (msg.senderId === this.selectedUser.userId || msg.receiverId === this.selectedUser.userId);

        if (isCurrentChat) {
          this.messages.push({ ...msg, isMine: msg.senderId === this.currentUserId });
          this.scrollToBottom();
        }

        // آپدیت unread و lastMessage در لیست
        this.updateChatListOnNewMessage(msg);
      })
    );
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadChatList() {
    this.chatService.getChatList().subscribe(res => {
      if (res.isSucceeded && res.data) {
        this.chatList = res.data.map(item => ({
          ...item,
          lastMessage: item.lastMessage || 'بدون پیام',
          lastMessageTime: item.lastMessageTime ? new Date(item.lastMessageTime) : undefined
        }));
      }
    });
  }

  selectChat(user: ChatListItem) {
    if (this.selectedUser?.userId === user.userId) return;

    this.selectedUser = user;
    this.messages = [];
    this.loadMessages(user.userId);

    // مارک به عنوان خوانده شده
    if (user.unreadCount > 0) {
      this.chatService.markAsRead(user.userId).subscribe(() => {
        user.unreadCount = 0;
      });
    }
  }

  private loadMessages(otherUserId: number) {
    this.chatService.getChatHistory(otherUserId).subscribe(res => {
      if (res.isSucceeded && res.data) {
        this.messages = res.data.map(m => ({
          ...m,
          isMine: m.senderId === this.currentUserId,
          sentAt: new Date(m.sentAt)
        })).reverse();

        this.scrollToBottom();
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.messageType = file.type.startsWith('image/') ? 'Image' : 'File';
  }

  sendMessage() {
    if (!this.selectedUser) {
      this.toast.error('کاربر انتخاب نشده');
      return;
    }
  
    if (!this.newMessage.trim() && !this.selectedFile) return;
  
    // ساخت FormData
    const formData = new FormData();
    formData.append('ReceiverId', this.selectedUser.userId.toString());
    if (this.newMessage.trim()) formData.append('Content', this.newMessage);
    if (this.selectedFile) formData.append('File', this.selectedFile, this.selectedFile.name);
    formData.append('Type', this.messageType);
  
    // این خط رو تغییر بده: به جای SendMessageDto، مستقیم formData بفرست
    this.chatService.sendMessage(formData).subscribe({
      next: () => {
        this.newMessage = '';
        this.selectedFile = null;
        this.messageType = 'Text';
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        // پیام از طریق SignalR خودش اضافه می‌شه
      },
      error: (err) => {
        console.error('Send message error:', err);
        this.toast.error('خطا در ارسال پیام');
      }
    });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom() {
    if (this.chatBody) {
      setTimeout(() => {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }, 100);
    }
  }

  private updateChatListOnNewMessage(msg: MessageDto) {
    if (msg.receiverId === this.currentUserId) {
      const existing = this.chatList.find(c => c.userId === msg.senderId);
      if (existing) {
        existing.unreadCount++;
        existing.lastMessage = msg.content || (msg.type === 'Image' ? 'تصویر' : 'فایل');
        existing.lastMessageTime = new Date(msg.sentAt);

        // ببر بالا
        this.chatList = this.chatList.filter(c => c.userId !== msg.senderId);
        this.chatList.unshift(existing);
      } else {
        // کاربر جدید → لیست رو رفرش کن
        this.loadChatList();
      }
    }
  }

  // جستجو در لیست چت
  get filteredChatList() {
    if (!this.searchText.trim()) return this.chatList;

    return this.chatList.filter(user =>
      user.fullName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}