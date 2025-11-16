// src/app/views/chat/chat/chat.component.ts
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ToastService } from 'src/app/services/utilities/toast.service';
import { MessageDto, ChatListItem, SendMessageDto } from 'src/app/dto/chat/MessageDto';
import { ListRequest } from 'src/app/dto/ListRequestDto';
import { ApiResult } from 'src/app/dto/api-result';
import { AuthService } from 'src/app/services/auth/login/auth.service';
import { RouterModule } from '@angular/router';

// --- CoreUI Components ---
import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  CardFooterComponent,
  BadgeComponent,
  ColComponent,
  RowComponent,
  ButtonDirective
} from '@coreui/angular';

// --- IconComponent ---
import { IconComponent } from '@coreui/icons-angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from 'src/app/icons/icon-subset';

// --- Filter Pipe ---
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { UserManageService } from 'src/app/services/base/userManage/user-manage.service';

interface UserDto {
  id: number;
  fullname: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FilterPipe,

    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    BadgeComponent,
    ColComponent,
    RowComponent,
    ButtonDirective,
    IconComponent
  ],
  providers: [IconSetService],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatBody') private chatBody?: ElementRef;

  chatList: ChatListItem[] = [];
  allUsers: UserDto[] = [];
  selectedUser?: ChatListItem;
  messages: MessageDto[] = [];
  newMessage = '';
  selectedFile?: File;
  currentUserId = 0;
  pagination = new ListRequest({ pageNumber: 1, pageSize: 50 });
  totalUnread = 0;
  private shouldScroll = true;
  showUserList = false;
  searchTerm = '';

  private messageSub: any;

  constructor(
    private chatService: ChatService,
    private toast: ToastService,
    private auth: AuthService,
    private http: HttpClient,
    public iconSet: IconSetService,
    public userService: UserManageService
  ) {
    this.currentUserId = this.auth.getUserId();
    this.iconSet.icons = { ...iconSubset };
  }


  ngOnInit(): void {
    this.chatService.connect();
    this.loadChatList();
    this.loadTotalUnread();
    this.loadAllUsers();

    this.messageSub = this.chatService.getMessageReceived().subscribe(msg => {
      if (!msg) return; // اگر null بود، نادیده بگیر
    
      msg.isMine = msg.senderId === this.currentUserId;
      msg.senderName = msg.isMine ? 'شما' : this.selectedUser?.userName;
    
      if (this.selectedUser && 
          (msg.senderId === this.selectedUser.userId || msg.receiverId === this.selectedUser.userId)) {
        this.messages.push(msg);
        this.shouldScroll = true;
      } else {
        this.loadChatList();
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.chatBody) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.messageSub?.unsubscribe();
    this.chatService.disconnect();
  }

  private scrollToBottom(): void {
    try {
      this.chatBody!.nativeElement.scrollTop = this.chatBody!.nativeElement.scrollHeight;
    } catch {}
  }

  loadChatList() {
    this.chatService.getChatList().subscribe((res: ApiResult<ChatListItem[]>) => {
      if (res.isSucceeded) this.chatList = res.data || [];
    });
  }

  loadTotalUnread() {
    this.chatService.getTotalUnreadCount().subscribe((res: ApiResult<number>) => {
      if (res.isSucceeded) this.totalUnread = res.data || 0;
    });
  }

  loadAllUsers() {
    return this.userService.getRecordList()
  ;
  }

  selectUser(user: ChatListItem) {
    this.selectedUser = user;
    this.messages = [];
    this.loadMessages();
    this.chatService.openChat(user.userId);
    this.chatService.markAsRead(user.userId).subscribe();
    this.loadTotalUnread();
    this.shouldScroll = true;
  }

  startNewChat(user: UserDto) {
    const existing = this.chatList.find(c => c.userId === user.id);
    if (existing) {
      this.selectUser(existing);
    } else {
      const newChat: ChatListItem = {
        userId: user.id,
        userName: user.fullname,
        lastMessage: '',
        lastMessageTime: new Date(),
        unreadCount: 0,
        isOnline: false,
        lastSeen: new Date()
      };
      this.chatList.unshift(newChat);
      this.selectUser(newChat);
    }
    this.showUserList = false;
    this.searchTerm = '';
  }

  loadMessages() {
    if (!this.selectedUser) return;
    this.chatService.getChatHistory(this.selectedUser.userId, this.pagination).subscribe((res: ApiResult<MessageDto[]>) => {
      if (res.isSucceeded) {
        this.messages = (res.data || []).map(m => ({
          ...m,
          isMine: m.senderId === this.currentUserId
        }));
        this.shouldScroll = true;
      }
    });
  }

  sendMessage() {
    if (!this.selectedUser || (!this.newMessage.trim() && !this.selectedFile)) return;

    const dto: SendMessageDto = {
      receiverId: this.selectedUser.userId,
      content: this.newMessage,
      file: this.selectedFile,
      type: this.selectedFile ? (this.selectedFile.type.startsWith('image') ? 'Image' : 'File') : 'Text'
    };

    this.chatService.sendMessage(dto).subscribe((res: ApiResult<MessageDto>) => {
      if (res.isSucceeded && res.data) {
        this.messages.push({ ...res.data, isMine: true });
        this.newMessage = '';
        this.selectedFile = undefined;
        this.shouldScroll = true;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}