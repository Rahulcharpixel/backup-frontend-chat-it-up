import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  constructor(private router: Router) { }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('mobile');
    this.router.navigate(['/login']);
  }

}

