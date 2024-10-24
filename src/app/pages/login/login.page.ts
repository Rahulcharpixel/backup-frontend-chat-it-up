import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { OtpService } from "src/app/services/otp.service";

import { otpStore } from "src/app/store/otp.store";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage {
  loginForm: FormGroup;

  mobile!: string;

  constructor(
    private fb: FormBuilder,
    private otpService: OtpService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      mobile: ["", [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.mobile = this.loginForm.value.mobile;

      console.log("==>", this.mobile);
      this.otpService.login(this.mobile).subscribe({
        next: (response: any) => {
          console.log(`Your OTP is: ${response.otp}`);

          localStorage.setItem('mobile', this.mobile);
          localStorage.setItem('authToken', response.token);

          this.router.navigate(["/otp-verification"]);
        },
        error: (error) => {
          console.error("Error sending OTP", error);
          alert(error.error.message);
        },
      });
    }
  }
}
