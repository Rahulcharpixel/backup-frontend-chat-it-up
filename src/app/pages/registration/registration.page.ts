import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { OtpService } from 'src/app/services/otp.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage{
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private otpService: OtpService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

 

  register() {
    if (this.registerForm.valid) {
      this.otpService.registerUser(this.registerForm.value.name, this.registerForm.value.email, this.registerForm.value.mobile)
        .subscribe({
          next: (response: any) => {
            console.log(response.message);
            alert('Registration successful! Please login.'); 
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Error during registration', error);
            alert(error.error.message); 
          }
        });
    }
  }
}
