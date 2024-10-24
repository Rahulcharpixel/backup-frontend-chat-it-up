import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {}

  joinChat(chatId: string) {
    this.socket.emit('joinChat', { chatId });
  }

  sendMessage(chatId: string, senderId: string, content: string) {
    this.socket.emit('sendMessage', { chatId, senderId, content });
  }

  receiveMessage() {
    return this.socket.fromEvent('newMessage');
  }

  leaveChat(chatId: string) {
    this.socket.emit('leaveChat', { chatId });
  }
}
