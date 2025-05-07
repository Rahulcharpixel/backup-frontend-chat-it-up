import { Injectable } from '@angular/core';
import { makeAutoObservable } from 'mobx';

@Injectable({
  providedIn: 'root',
})
export class ChatStore {
  messages: any[] = [];
  currentChatId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setCurrentChat(chatId: string) {
    this.currentChatId = chatId;
  }

  addMessage(message: any) {
    this.messages.push(message);
  }

  setMessages(messages: any[]) {
    this.messages = messages;
  }
}