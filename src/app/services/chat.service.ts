import { HttpClient,  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:80/api/chat';  

  constructor(private http: HttpClient) {}

  sendChatRequest(senderId: string, receiverId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-chat-request`, { senderId, receiverId });
  }

  acceptChatRequest(chatRequestId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/accept-chat-request`, { chatRequestId });
  }

  getMessages(chatId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${chatId}/messages`);
  }

  editMessage(chatId: string, messageId: string, newContent: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit-message/${chatId}/${messageId}`, { newContent });
  }

  deleteMessage(chatId: string, messageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-message/${chatId}/${messageId}`);
  }
}
