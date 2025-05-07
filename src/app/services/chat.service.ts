import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL, BASE_URL, BASE_URL_CHAT } from '../Constants/baseurls.const';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io(API_BASE_URL, {
      transports: ['websocket'],
      reconnection: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected!', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected!');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  joinRoom(roomId: string, userId: string) {
    this.socket.emit('joinRoom', { roomId, userId });
  }
  onRoomJoined(callback: (data: any) => void) {
    this.socket.on("roomJoined", callback);
  }

  onRecentMessages(callback: (data: any[]) => void) {
    this.socket.on("recentMessages", callback);
  }

  onMessage(callback: (data: any) => void) {
    this.socket.on('newMessage', callback);
  }

  onMessageDeleted(callback: (data: { roomId: string; messageId: string }) => void) {
    this.socket.on('messageDeleted', callback);
  }

  onAllMessagesDeleted(callback: (data: { roomId: string }) => void) {
    this.socket.on('allMessagesDeleted', callback);
  }

  onUserJoined(callback: (data: { roomId: string, userId: string, message: string }) => void) {
    this.socket.on('userJoined', callback);
  }

  onUserLeft(callback: (data: { roomId: string, userId: string, message?: string, username?: string }) => void) {
    this.socket.on('userLeft', callback);
  }

  onCreatorLeft(callback: (data: { roomId: string, userId: string, message: string, username?: string }) => void) {
    this.socket.on('creatorLeft', callback);
  }

  onCheckFirstJoin(callback: (data: { roomId: string, userId: string }) => void) {
    this.socket.on('checkFirstJoin', callback);
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  getMessages(roomId: string): Observable<{ messages: any[] }> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.get<{ messages: any[] }>(`${BASE_URL_CHAT}/message/${roomId}`, { headers });
  }

  sendMessage(data: { roomId: string; message: string }): Observable<{ chatMessage: any }> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.post<{ chatMessage: any }>(`${BASE_URL_CHAT}/send-message`, data, { headers });
  }

  getGroups(): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.get(`${BASE_URL}/groups`, { headers });
  }

  deleteMessage(messageId: string): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.delete(`${BASE_URL_CHAT}/delete-message/${messageId}`, { headers });
  }

  deleteAllMessages(roomId: string): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.delete(`${BASE_URL_CHAT}/delete-all-messages/${roomId}`, { headers });
  }

  getRoomUsers(roomId: string): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.get(`${BASE_URL_CHAT}/users/${roomId}`, { headers });
  }

  leaveRoom(roomId: string): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);

    // Emit leaveRoom event to socket server
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.socket.emit('leaveRoom', { roomId, userId });
    }

    return this.http.delete<any>(`${BASE_URL_CHAT}/leave-room/${roomId}`, { headers });
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  blockUser(roomId: string, userId: string, blockType: 'room' | 'global'): Observable<any> {
    return this.http.post(`${BASE_URL_CHAT}/block-user`, {
      roomId,
      userId,
      blockType
    });
  }

  getBlockedUsers(roomId: string): Observable<any> {
    return this.http.get(`${BASE_URL_CHAT}/blocked-users/${roomId}`);
  }

  isUserBlocked(roomId: string, userId: string): Observable<any> {
    return this.http.get(`${BASE_URL_CHAT}/is-blocked/${roomId}/${userId}`);
  }
}




