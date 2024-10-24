import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuth();
  }

  ionViewWillEnter() {
    this.checkAuth();
  }

  checkAuth() {
    this.isLoggedIn = !!localStorage.getItem('token'); 
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('mobile');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
