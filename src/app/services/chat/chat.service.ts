// src/app/services/chat/chat.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { ApiResult } from 'src/app/dto/api-result';
import { ChatListItem, MessageDto, SendMessageDto } from 'src/app/dto/chat/MessageDto';
import { AuthService } from '../auth/login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl + '/api/Chat';
  private hubConnection!: HubConnection;

  // برای پخش پیام جدید realtime
  public messageReceived = new Subject<MessageDto>();
  public chatListUpdated = new Subject<void>();
  public unreadCountUpdated = new Subject<void>();

  constructor(private http: HttpClient, private auth: AuthService) {
    this.createConnection();
    this.startConnection();
    this.registerOnServerEvents();
  }

  private createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.apiUrl + '/chatHub', {
        accessTokenFactory: () => this.auth.getToken() || ''
      })
      .withAutomaticReconnect()
      .build();
  }

  private startConnection() {
    this.hubConnection.start().catch(err => console.error('SignalR Connection Error: ', err));
  }

  private registerOnServerEvents() {
    this.hubConnection.on('ReceiveMessage', (message: MessageDto) => {
      this.messageReceived.next(message);
      this.chatListUpdated.next(); // برای آپدیت unread در لیست
    });
  }

  // لیست چت‌ها
  getChatList(): Observable<ApiResult<ChatListItem[]>> {
    return this.http.get<ApiResult<ChatListItem[]>>(`${this.apiUrl}/list`);
  }

  // تاریخچه پیام با کاربر خاص
  getChatHistory(otherUserId: number, page: number = 1, pageSize: number = 50): Observable<ApiResult<MessageDto[]>> {
    return this.http.get<ApiResult<MessageDto[]>>(`${this.apiUrl}/history`, {
      params: { otherUserId, pageNumber: page, pageSize }
    });
  }

  // ارسال پیام (HTTP)
  sendMessage(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, formData);
  }

  // مارک کردن به عنوان خوانده شده
  markAsRead(receiverId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-as-read`, { senderId: this.auth.getUserId(), receiverId });
  }
}