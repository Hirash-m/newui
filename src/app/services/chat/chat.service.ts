// src/app/services/chat/chat.service.ts
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageDto, ChatListItem, SendMessageDto } from 'src/app/dto/chat/MessageDto';
import { ListRequest } from 'src/app/dto/ListRequestDto';
import { ApiResult } from 'src/app/dto/api-result';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly baseUrl = 'http://localhost:90';
  private readonly hubUrl = `${this.baseUrl}/chatHub`;

  private hubConnection!: HubConnection;
  private messageReceived = new BehaviorSubject<MessageDto | null>(null);

  constructor(private http: HttpClient) {}

  // ---------------- SignalR ----------------
  public async connect(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('توکن وجود ندارد. لطفاً لاگین کنید.');
      return;
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect([0, 2000, 10000])
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection.on('ReceiveMessage', (message: MessageDto) => {
      console.log('پیام دریافت شد:', message);
      this.messageReceived.next(message);
    });

    try {
      await this.hubConnection.start();
      console.log('اتصال SignalR برقرار شد');
    } catch (err) {
      console.error('خطا در اتصال SignalR:', err);
    }
  }

  public disconnect(): void {
    this.hubConnection?.stop().then(() => console.log('اتصال SignalR قطع شد'));
  }

  public getMessageReceived(): Observable<MessageDto | null> {
    return this.messageReceived.asObservable();
  }

  public openChat(userId: number): void {
    this.hubConnection?.invoke('OpenChat', userId)
      .catch(err => console.error('OpenChat error:', err));
  }

  // ---------------- API ----------------
  // تمام API ها از Interceptor استفاده می‌کنند
  getChatList(): Observable<ApiResult<ChatListItem[]>> {
    return this.http.get<ApiResult<ChatListItem[]>>(`${this.baseUrl}/api/chat/list`);
  }

  getTotalUnreadCount(): Observable<ApiResult<number>> {
    return this.http.get<ApiResult<number>>(`${this.baseUrl}/api/chat/unread-count`);
  }

  getChatHistory(userId: number, request: ListRequest): Observable<ApiResult<MessageDto[]>> {
    return this.http.post<ApiResult<MessageDto[]>>(`${this.baseUrl}/api/chat/history/${userId}`, request);
  }

  sendMessage(dto: SendMessageDto): Observable<ApiResult<MessageDto>> {
    const formData = new FormData();
    formData.append('receiverId', dto.receiverId.toString());
    formData.append('content', dto.content || '');
    formData.append('type', dto.type);
    if (dto.file) formData.append('file', dto.file);

    // هیچ هدر Content-Type دستی اضافه نمی‌کنیم، مرورگر خودش ست می‌کنه
    return this.http.post<ApiResult<MessageDto>>(`${this.baseUrl}/api/chat/send`, formData);
  }

  markAsRead(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/chat/mark-as-read/${userId}`, {});
  }
}
