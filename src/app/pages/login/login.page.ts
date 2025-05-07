import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtpService } from 'src/app/services/otp.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private otpService: OtpService,
    private router: Router,
    private loadingController: LoadingController
  ) {
    this.loginForm = this.fb.group({
      countryCode: ['+91', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  async login() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        spinner: 'circles',
        duration: 5000,
      });
      await loading.present();

      const fullMobileNumber = this.loginForm.value.countryCode + this.loginForm.value.mobile;

      this.otpService.login(fullMobileNumber).subscribe({
        next: async (response: any) => {
          alert(`Your OTP is: ${response.otp}`)
          console.log(`Your OTP is: ${response.otp}`);
          localStorage.setItem('mobile', this.loginForm.value.mobile);
          localStorage.setItem('countryCode', this.loginForm.value.countryCode);
          localStorage.setItem('authToken', response.token);
          await loading.dismiss();
          this.router.navigate(['/otp-verification']);
        },
        error: async (error) => {
          await loading.dismiss();
          console.error('Error sending OTP', error);
          alert(error.error.message);
        }
      });
    }
  }
}
