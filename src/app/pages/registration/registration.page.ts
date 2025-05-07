import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtpService } from 'src/app/services/otp.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private otpService: OtpService,
    private router: Router,
    private loadingController: LoadingController
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+91', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

  async register() {
    if (this.registerForm.valid) {
      const loading = await this.loadingController.create({
        spinner: 'circles',
        duration: 5000,
      });
       loading.present();
       const fullMobileNumber = this.registerForm.value.countryCode + this.registerForm.value.mobile;
       
      this.otpService.registerUser(this.registerForm.value.name, this.registerForm.value.email, fullMobileNumber)
        .subscribe({
          next: async (response: any) => {
            console.log(response.message);
            await loading.dismiss();
            alert('Registration successful! Please login.');
            this.router.navigate(['/login']);
          },
          error: async (error) => {
            await loading.dismiss();
            console.error('Error during registration', error);
            alert(error.error.message);
          }
        });
    }
  }
}
