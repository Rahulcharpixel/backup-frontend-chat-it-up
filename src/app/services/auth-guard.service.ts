import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { OtpService } from './otp.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private otpService: OtpService, private router: Router) { }

  canActivate(): boolean {
    if (this.otpService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
