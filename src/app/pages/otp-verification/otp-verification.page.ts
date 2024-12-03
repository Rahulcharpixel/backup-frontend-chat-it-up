import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { OtpService } from "../../services/otp.service";
import { Router } from "@angular/router";
import { otpStore } from "../../store/otp.store";
import { IonInput, LoadingController } from "@ionic/angular";
import { jwtDecode } from "jwt-decode";

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
    private router: Router,
    private loadingController: LoadingController,
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

  async verify() {
    if (this.otpForm.valid) {
      const loading = await this.loadingController.create({
        spinner: 'circles',
        duration: 5000,
      });
      await loading.present();
      const mobile = otpStore.mobile;
      const otp = this.otpControls.value.join("");
      this.otpService.verify({ mobile, otp }).subscribe({
        next: async (response: any) => {
          const token = response.token;
          localStorage.setItem("authToken", response.token);

          const decodedToken: any = jwtDecode(token);
          localStorage.setItem("userId", decodedToken.id);
          await loading.dismiss();

          this.router.navigateByUrl('/home');
          otpStore.clear();
        },
        error: async (error) => {
          await loading.dismiss();
          console.error("Error verifying OTP", error);
          alert(error.error.message);
        },
      });
    }
  }

  async resendOtp() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      duration: 5000,
    });
    await loading.present();
    const mobile = otpStore.mobile;
    if (!mobile) {
      alert("No mobile number available to resend OTP.");
      return;
    }

    this.otpService.login(mobile).subscribe({
      next: async (response: any) => {
        console.log(response.message);
        console.log(response.otp);
        alert(`OTP sent successfully! to ${mobile}`);
        await loading.dismiss();
      },
      error: async (error) => {
        await loading.dismiss();
        console.error("Error sending OTP", error);
        alert(error.error.message);
      },
    });
  }
}
