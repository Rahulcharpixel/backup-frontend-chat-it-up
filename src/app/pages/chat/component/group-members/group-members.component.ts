import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss'],
})
export class GroupMembersComponent implements OnInit, OnChanges {
  @Input() roomId: string = '';
  @Input() isOpen: boolean = false;

  roomUsers: any[] = [];
  roomCreator: any = null;
  userId: string = '';
  isLoading: boolean = true;
  displayStyle: string = 'none';

  constructor(
    private chatService: ChatService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    const id = localStorage.getItem('userId');
    if (id) this.userId = id;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['roomId'] && this.roomId) {
      this.loadRoomUsers();
    }

    if (changes['isOpen']) {
      this.displayStyle = this.isOpen ? 'block' : 'none';
    }
  }

  loadRoomUsers() {
    if (!this.roomId) return;

    this.isLoading = true;
    this.chatService.getRoomUsers(this.roomId).subscribe({
      next: (data) => {
        this.roomUsers = data.participants || [];
        this.roomCreator = data.creator;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load room users', err);
        this.isLoading = false;
      }
    });
  }

  dismiss() {
      this.modalController.dismiss();
  }
}
