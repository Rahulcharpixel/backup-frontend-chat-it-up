import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OtpService } from './services/otp.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private otpService: OtpService, private router: Router) {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    setTimeout(() => {  
      if (!this.otpService.isAuthenticated()) {
        this.router.navigate(['/login']);
      }
    }, 0);  
  }
}

