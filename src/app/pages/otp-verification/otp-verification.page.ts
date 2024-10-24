import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { OtpService } from "../../services/otp.service";
import { Router } from "@angular/router";
import { otpStore } from "../../store/otp.store";
import { IonInput } from "@ionic/angular";

@Component({
  selector: "app-otp-verification",
  templateUrl: "./otp-verification.page.html",
  styleUrls: ["./otp-verification.page.scss"],
})
export class OtpVerificationPage implements OnInit {
  otpForm: FormGroup;

  @ViewChildren("otpInput") otpInputs!: QueryList<IonInput>;

  constructor(
    private fb: FormBuilder,
    private otpService: OtpService,
    private router: Router
  ) {
    this.otpForm = this.fb.group({
      otpInputs: this.fb.array(
        Array(4)
          .fill("")
          .map(() => [
            "",
            [
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(1),
            ],
          ])
      ),
    });
  }

  ngOnInit() {
    otpStore.mobile = localStorage.getItem("mobile") || "";
  }

  get otpControls() {
    return this.otpForm.get("otpInputs") as FormArray;
  }

  onInputChange(index: number) {
    const otpControl = this.otpControls.controls[index];

    if (otpControl.value.length === 1 && index < this.otpControls.length - 1) {
      const nextInput = this.otpInputs.get(index + 1);
      if (nextInput) {
        nextInput.setFocus();
      }
    }
  }

  verify() {
    if (this.otpForm.valid) {
      const mobile = otpStore.mobile;
      const otp = this.otpControls.value.join("");
      this.otpService.verify({ mobile, otp }).subscribe({
        next: (response: any) => {
          localStorage.setItem("authToken", response.token);
          console.log("JWT Token:", response.token);
          alert(response.message)
          // console.log(response.message);
          this.router.navigateByUrl('/home');
          otpStore.clear();
        },
        error: (error) => {
          console.error("Error verifying OTP", error);
          alert(error.error.message);
        },
      });
    }
  }

  resendOtp() {
    const mobile = otpStore.mobile;
    if (!mobile) {
      alert("No mobile number available to resend OTP.");
      return;
    }

    this.otpService.login(mobile).subscribe({
      next: (response: any) => {
        console.log(response.message);
        console.log(response.otp);
        alert("OTP sent successfully!");
      },
      error: (error) => {
        console.error("Error sending OTP", error);
        alert(error.error.message);
      },
    });
  }
}
