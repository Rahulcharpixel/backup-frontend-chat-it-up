import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OtpService } from 'src/app/services/otp.service';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage {


  constructor(private otpService: OtpService, private router: Router) { }

  // logout() {
  //   this.otpService.logout();
  //   this.router.navigate(['/login']);
  // }
}
