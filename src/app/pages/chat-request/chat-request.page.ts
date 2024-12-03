
import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';


@Component({
  selector: 'app-chat-request',
  templateUrl: './chat-request.page.html',
  styleUrls: ['./chat-request.page.scss'],
})
export class ChatRequestPage {
  // senderId = '';  
  // receiverId = '';

  constructor(private chatService: ChatService
  ) {}

  // sendChatRequest() {
  //   this.chatService.sendChatRequest(this.senderId, this.receiverId).subscribe(
  //     res => {
  //       console.log('Chat request sent', res);
  //     },
  //     err => {
  //       console.error('Error sending chat request', err);
  //     }
  //   );
  // }
}
