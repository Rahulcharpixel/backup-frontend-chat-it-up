import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ModalController, AlertController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  roomId: string = '';
  messages: any[] = [];
  newMessage = '';
  isCreator = false;
  isLoading = true;
  userId: string = '';
  isMember = true;
  roomUsers: any[] = [];
  roomCreator: any = null;
  showUsersList = false;
  isGroupDeleted = false;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private menuCtrl: MenuController,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    const id = localStorage.getItem('userId');
    if (id) this.userId = id;

    this.route.paramMap.subscribe(params => {
      const roomId = params.get('roomId');
      if (roomId) {
        this.roomId = roomId;
        this.initializeChat();
      } else {
        console.error('No roomId provided');
      }
    });

    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  private handleDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.message-options') && !target.closest('.message-options-menu')) {
      this.messages.forEach(msg => {
        msg.showOptions = false;
      });
    }
  }

  private initializeChat() {
    this.isLoading = true;
    this.loadMessages();
    this.loadRoomUsers();

    if (this.userId && this.roomId) {
      this.chatService.joinRoom(this.roomId, this.userId);
    }

    this.chatService.onRoomJoined((data) => {
      if (data?.creatorId) {
        this.isCreator = data.creatorId === this.userId;
      }
    });

    // Handle recent messages from socket
    this.chatService.onRecentMessages((messages) => {
      if (messages && messages.length > 0 && !this.isGroupDeleted) {
        const mappedMessages = messages.map(msg => ({
          ...msg,
          senderId: {
            name: msg.senderId?._id === this.userId ? 'You' : msg.senderId?.name || 'User'
          },
          showOptions: false,
          deleted: msg.isDeleted || false,
          message: msg.isDeleted ? 'Message deleted' : msg.message,
          isSystemMessage: false
        }));

        // Only update messages if we don't have any yet
        if (this.messages.length === 0) {
          this.messages = mappedMessages.reverse();
          this.isLoading = false;
          setTimeout(() => this.scrollToBottom(), 500);
        }
      }
    });


    this.chatService.onCheckFirstJoin((data) => {
      if (data && data.roomId === this.roomId && data.userId === this.userId) {
        const joinedRooms = JSON.parse(localStorage.getItem('joinedRooms') || '{}');

        if (!joinedRooms[this.roomId]) {

          joinedRooms[this.roomId] = true;
          localStorage.setItem('joinedRooms', JSON.stringify(joinedRooms));

          this.chatService.emit('userFirstJoin', {
            roomId: this.roomId,
            userId: this.userId,
            message: 'A new user has joined the room!'
          });
        }
      }
    });

    this.chatService.onMessage((data) => {
      if (data && data.roomId === this.roomId && !this.isGroupDeleted) {
        const tempMessageIndex = this.messages.findIndex(msg =>
          msg._id.startsWith('temp-') &&
          msg.message === data.message &&
          msg.senderId.name === 'You'
        );

        if (tempMessageIndex !== -1) {
          this.messages[tempMessageIndex] = {
            senderId: { name: data.senderId === this.userId ? 'You' : 'User' },
            message: data.isDeleted ? 'Message deleted' : data.message,
            timestamp: data.timestamp,
            _id: data._id,
            showOptions: false,
            deleted: data.isDeleted || false,
            isSystemMessage: false
          };
        } else {
          this.messages.push({
            senderId: { name: data.senderId === this.userId ? 'You' : 'User' },
            message: data.isDeleted ? 'Message deleted' : data.message,
            timestamp: data.timestamp,
            _id: data._id,
            showOptions: false,
            deleted: data.isDeleted || false,
            isSystemMessage: false
          });
        }

        setTimeout(() => this.scrollToBottom(), 300);
      }
    });

    this.chatService.onMessageDeleted((data: { roomId: string; messageId: string }) => {
      if (data && data.roomId === this.roomId) {
        const messageIndex = this.messages.findIndex(msg => !msg.isSystemMessage && msg._id === data.messageId);
        if (messageIndex !== -1) {
          this.messages[messageIndex].deleted = true;
          this.messages[messageIndex].message = 'Message deleted';
          this.messages[messageIndex].showOptions = false;
        }
      }
    });

    this.chatService.onAllMessagesDeleted((data: { roomId: string }) => {
      if (data && data.roomId === this.roomId) {
        this.messages = [];
        this.addSystemMessage('Admin cleared all messages');
        setTimeout(() => this.scrollToBottom(), 300);
      }
    });

    // Add handlers for user join/leave events
    this.chatService.onUserJoined((data: { roomId: string, userId: string, message: string }) => {
      if (data && data.roomId === this.roomId && !this.isGroupDeleted) {
        this.addSystemMessage(data.message || 'A user joined the chat');
        this.loadRoomUsers(); // Refresh room users list
        setTimeout(() => this.scrollToBottom(), 300);
      }
    });

    this.chatService.onUserLeft((data: { roomId: string, userId: string, message?: string, username?: string }) => {
      if (data && data.roomId === this.roomId && !this.isGroupDeleted) {
        if (data.message) {
          this.addSystemMessage(data.message);
        } else if (data.username) {
          this.addSystemMessage(`${data.username} left the chat`);
        } else {
          this.addSystemMessage('A user left the chat');
        }
        this.loadRoomUsers();
        setTimeout(() => this.scrollToBottom(), 300);
      }
    });

    // Add handler for creator left event
    this.chatService.onCreatorLeft((data: { roomId: string, userId: string, message: string, username?: string }) => {
      if (data && data.roomId === this.roomId) {
        this.isGroupDeleted = true;
        this.addSystemMessage(data.message);
        this.showCreatorLeftAlert();
        setTimeout(() => this.router.navigate(['/quiz-list']), 3000);
      }
    });
  }

  private addSystemMessage(text: string) {
    this.messages.push({
      message: text,
      timestamp: new Date(),
      isSystemMessage: true
    });
  }

  async showCreatorLeftAlert() {
    const alert = await this.alertController.create({
      header: 'Group Creator Left',
      message: 'The creator of this group has left. The group will be deleted.',
      buttons: ['OK']
    });
    await alert.present();
  }

  loadMessages() {
    this.chatService.getMessages(this.roomId).subscribe({
      next: (res) => {
        // Only load messages from HTTP if we don't have any messages yet
        // This prevents duplicate messages when both socket and HTTP return messages
        if (this.messages.length === 0) {
          const mappedMessages = (res.messages || []).map(msg => ({
            ...msg,
            senderId: {
              name: msg.senderId?._id === this.userId ? 'You' : msg.senderId?.name || 'User'
            },
            showOptions: false,
            deleted: msg.isDeleted || false,
            message: msg.isDeleted ? 'Message deleted' : msg.message,
            isSystemMessage: false
          }));
          this.messages = mappedMessages.reverse();
          this.isLoading = false;
          this.isMember = true;
          setTimeout(() => this.scrollToBottom(), 500);
        } else {
          this.isLoading = false;
          this.isMember = true;
        }
      },
      error: (err: any) => {
        console.error('Failed to load messages', err);
        this.isLoading = false;
        if (err.status === 403 || err.error?.message === 'Not a member') {
          this.isMember = false;
          alert('You are not a member of this group.');
        }
      },
    });
  }

  loadRoomUsers() {
    if (!this.roomId) return;

    this.chatService.getRoomUsers(this.roomId).subscribe({
      next: (data) => {
        this.roomUsers = data.participants || [];
        this.roomCreator = data.creator;
        this.isCreator = data.isCreator;

        // Check if the group is deleted
        if (data.isDeleted) {
          this.isGroupDeleted = true;
          this.addSystemMessage('This group has been deleted by the creator.');
          setTimeout(() => this.router.navigate(['/quiz-list']), 3000);
        }
      },
      error: (err) => {
        console.error('Failed to load room users', err);
      }
    });
  }

  toggleMessageOptions(index: number) {
    this.messages.forEach((msg, i) => {
      if (i !== index) {
        msg.showOptions = false;
      }
    });
    this.messages[index].showOptions = !this.messages[index].showOptions;
  }

  async deleteMessage(index: number) {
    const message = this.messages[index];

    // Show confirmation alert
    const alert = await this.alertController.create({
      header: 'Delete Message',
      message: 'Are you sure you want to delete this message?',
      cssClass: 'delete-message-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Delete',
          cssClass: 'delete-button',
          handler: () => {
            if (message && message._id) {
              this.chatService.deleteMessage(message._id).subscribe({
                next: () => {
                  this.messages[index].deleted = true;
                  this.messages[index].message = 'Message deleted';
                  this.messages[index].showOptions = false;
                  // console.log('Message deleted successfully');
                },
                error: (err) => {
                  console.error('Failed to delete message', err);
                  this.alertController.create({
                    header: 'Error',
                    message: 'Failed to delete message',
                    buttons: ['OK']
                  }).then(alert => alert.present());
                }
              });
            } else {
              this.messages[index].deleted = true;
              this.messages[index].message = 'Message deleted';
              this.messages[index].showOptions = false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  sendMessage() {
    if (this.isGroupDeleted) {
      alert('This group has been deleted. You cannot send messages.');
      return;
    }

    const text = this.newMessage.trim();
    if (!text || !this.roomId) return;

    const payload = {
      roomId: this.roomId,
      message: text,
    };

    // Create a temporary message object to add to the UI immediately
    const tempMessage = {
      senderId: { name: 'You' },
      message: text,
      timestamp: new Date(),
      _id: 'temp-' + Date.now(), // Temporary ID
      showOptions: false,
      deleted: false,
      isSystemMessage: false
    };

    // Add the message to the UI immediately
    this.messages.push(tempMessage);
    this.newMessage = '';
    setTimeout(() => this.scrollToBottom(), 300);

    // Send the message to the server
    this.chatService.sendMessage(payload).subscribe({
      next: (response) => {
        // The message will be updated via socket event with the real ID
        // console.log('Message sent successfully', response);
      },
      error: (err) => {
        console.error('Send message failed', err);
        alert(err.error?.error || 'Could not send message');

        // Remove the temporary message if sending failed
        const index = this.messages.findIndex(msg => msg._id === tempMessage._id);
        if (index !== -1) {
          this.messages.splice(index, 1);
        }
      },
    });
  }

  DeleteAllChat() {
    if (!this.roomId || this.isGroupDeleted) return;

    const confirmed = confirm("Are you sure you want to delete all messages?");
    if (!confirmed) return;

    this.chatService.deleteAllMessages(this.roomId).subscribe({
      next: () => {
        console.log("All messages deleted request sent");
      },
      error: (err) => {
        console.error("Delete all messages failed", err);
        alert(err.error?.error || 'Failed to delete all messages');
      }
    });
  }

  openMenu() {
    this.menuCtrl.open();
  }

  viewProfile() {
    console.log('View Profile');
  }

  deletechat() {
    console.log('message delete');
    this.messages = [];
  }

  async blockUser(userId?: string) {
    if (!userId) {
      console.log('Block User menu item clicked');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Block User',
      message: 'Choose blocking type:',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Block from this room',
          handler: () => {
            this.blockUserFromRoom(userId);
          }
        },
        {
          text: 'Block globally',
          handler: () => {
            this.blockUserGlobally(userId);
          }
        }
      ]
    });

    await alert.present();
  }

  private async blockUserFromRoom(userId: string) {
    const confirmAlert = await this.alertController.create({
      header: 'Confirm Block',
      message: 'Are you sure you want to block this user from this room?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Block',
          handler: () => {
            this.chatService.blockUser(this.roomId, userId, 'room').subscribe({
              next: () => {
                this.showSuccessMessage('User blocked from this room');
                // Remove user's messages from the chat
                this.messages = this.messages.filter(msg => msg.senderId?._id !== userId);
                // Close message options
                this.messages.forEach(msg => {
                  msg.showOptions = false;
                });
              },
              error: (err) => {
                console.error('Failed to block user:', err);
                this.showErrorMessage('Failed to block user');
              }
            });
          }
        }
      ]
    });

    await confirmAlert.present();
  }

  private async blockUserGlobally(userId: string) {
    const confirmAlert = await this.alertController.create({
      header: 'Confirm Global Block',
      message: 'Are you sure you want to block this user from all your rooms? This will prevent them from joining any of your rooms and viewing your quiz answers.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Block',
          handler: () => {
            this.chatService.blockUser(this.roomId, userId, 'global').subscribe({
              next: () => {
                this.showSuccessMessage('User blocked globally');
                // Remove user's messages from the chat
                this.messages = this.messages.filter(msg => msg.senderId?._id !== userId);
                // Close message options
                this.messages.forEach(msg => {
                  msg.showOptions = false;
                });
              },
              error: (err) => {
                console.error('Failed to block user:', err);
                this.showErrorMessage('Failed to block user');
              }
            });
          }
        }
      ]
    });

    await confirmAlert.present();
  }

  private async showSuccessMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showErrorMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  leaveGroup() {
    if (!this.roomId || !this.userId || this.isGroupDeleted) return;

    const confirmed = confirm("Are you sure you want to leave this group? This will also delete your answers for this quiz.");
    if (!confirmed) return;

    this.chatService.leaveRoom(this.roomId).subscribe({
      next: () => {
        console.log('Successfully left the room via service call');
        this.isMember = false;
        this.menuCtrl.close();
        alert('You have left the group.');
        this.router.navigate(['/quiz-list']);
      },
      error: (err: any) => {
        console.error("Failed to leave room", err);
        alert(err.error?.error || 'Failed to leave the group');
        this.menuCtrl.close();
      }
    });
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        if (this.chatContainer && this.chatContainer.nativeElement) {
          this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        }
      }, 300);
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
