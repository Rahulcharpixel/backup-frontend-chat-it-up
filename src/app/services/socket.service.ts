
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io,Socket } from 'socket.io-client';
import { API_BASE_URL } from '../Constants/baseurls.const';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
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
    }
    joinRoom(roomId: string, userId: string) {
      this.socket.emit('joinRoom', { roomId, userId });
    }
  
    onMessage(callback: (data: any) => void) {
      this.socket.on('newMessage', callback);
    }
}
