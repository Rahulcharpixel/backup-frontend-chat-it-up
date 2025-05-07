import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-quiz-group-list',
  templateUrl: './quiz-group-list.page.html',
  styleUrls: ['./quiz-group-list.page.scss'],
})
export class QuizGroupListPage implements OnInit {
  groups: any[] = [];
  selectedGroup: any = null;
  showMembersModal = false;

  constructor(
    private chatService: ChatService,
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

  openChat(group: any) {
    console.log('---->>>>', group.roomId);
    this.router.navigate(["/chat", group.roomId]);
  }

  viewMembers(group: any) {
    this.selectedGroup = group;
    this.showMembersModal = true;
  }
}
