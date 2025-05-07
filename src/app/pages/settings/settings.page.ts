import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { UserProfileStore } from 'src/app/store/user-profile.store';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user: any;
  name: string = '';     
  mobile: string = ''; 

  constructor(
    private router: Router,
    private userService: UserService,
    private userProfileStore : UserProfileStore,
    private authGuardService : AuthGuardService

  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const userId = this.userProfileStore.getUserIdFromToken();
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (data) => {
         this.user = data;
         this.name = data.name;       
          this.mobile = data.mobile; 
        },
        (error) => {
          console.error('Error fetching user data', error);
        }
      );
    }
  }

  logout() {
    if (confirm('Are you sure you want to Logout your account?')) {
    this.authGuardService.logout();
    this.router.navigate(['/login']);
    }
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account?')) {
      if (confirm('If you delete an account, you will permanently lose all data associated with that account')) {
      const userId = this.userService.getUserIdFromToken();
      if (userId) {
        this.userService.deleteAccount(userId).subscribe(
          () => {
            alert('Account deleted successfully');
            this.authGuardService.logout();
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Error deleting account', error);
            alert('Failed to delete account. Please try again.');
          }
        );
      }
    }}
  }

}
