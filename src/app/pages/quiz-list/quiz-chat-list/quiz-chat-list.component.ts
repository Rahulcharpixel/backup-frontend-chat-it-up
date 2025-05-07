// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-quiz-chat-list',
//   templateUrl: './quiz-chat-list.component.html',
//   styleUrls: ['./quiz-chat-list.component.scss'],
// })
// export class QuizChatListComponent  implements OnInit {

//   constructor() { }

//   ngOnInit() {}

// }

import { Component, OnInit } from "@angular/core";
import { ChatService } from "../../../services/chat.service";
import { ModalController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-quiz-chat-list",
  templateUrl: "./quiz-chat-list.component.html",
  styleUrls: ["./quiz-chat-list.component.scss"],
})
export class QuizChatListComponent implements OnInit {
  groups: any[] = [];

  constructor(
    private chatService: ChatService,
    private modalController: ModalController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.chatService.getGroups().subscribe({
      next: (response) => {
        console.log("Fetched groups:", response);
        this.groups = response.groups.filter((group: any) => !group.isDeleted);
      },
      error: (err) => {
        console.error("Error fetching groups:", err);
      },
    });
  }
  dismiss() {
    this.modalController.dismiss();
  }
  openChat(group: any) {
    console.log('---->>>>', group.roomId);
    this.dismiss();
    this.router.navigate(["/chat", group.roomId]);
  }
}
