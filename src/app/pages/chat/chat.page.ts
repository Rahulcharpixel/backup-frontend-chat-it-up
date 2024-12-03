import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  // userId = '';
  // chatId = '';
  // senderId = '';
  // message = '';
  // messages: any[] = [];

  constructor(
    // private route: ActivatedRoute,
    // private chatService: ChatService,
    // private socketService: SocketService
  ) { }

  ngOnInit() {
  //   this.route.params.subscribe(params => {
  //     this.userId = params['userId'];

  //     this.startChatWithUser();
  //   });
  }

  // startChatWithUser() {
  //   this.chatService.sendChatRequest(this.senderId, this.userId).subscribe(
  //     chat => {
  //       this.chatId = chat._id;
  //       this.socketService.joinChat(this.chatId);
  //       this.loadMessages();
  //     },
  //     err => console.error(err)
  //   );
  // }

  // loadMessages() {
  //   this.chatService.getMessages(this.chatId).subscribe(
  //     res => this.messages = res.messages,
  //     err => console.error(err)
  //   );
  // }

  // sendMessage() {
  //   if (this.message.trim()) {
  //     this.socketService.sendMessage(this.chatId, this.senderId, this.message);
  //     this.message = '';
  //     console.log('-->', this.message='');
  //   }
  // }
}
