// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-tabs',
//   templateUrl: './tabs.component.html',
//   styleUrls: ['./tabs.component.scss'],
// })
// export class TabsComponent  implements OnInit {

 
//   isLoggedIn: boolean = false;

//   constructor( private router: Router) {}

// ngOnInit(): void {
//     this.checkAuth()
// }

// ionViewWillEnter() {
//   this.checkAuth();
// }
//   checkAuth() {
//     this.isLoggedIn = !!localStorage.getItem('authToken'); 
//     if (!this.isLoggedIn) {
//       this.router.navigate(['/login']);
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OtpService } from 'src/app/services/otp.service';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private otpService: OtpService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuth();
  }

  ionViewWillEnter() {
    this.checkAuth();
  }

  checkAuth() {
    this.isLoggedIn = this.otpService.isAuthenticated();
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }
}
