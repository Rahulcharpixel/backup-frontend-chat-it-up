import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from "@angular/core";
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
export class OtpVerificationPage implements OnInit, AfterViewInit {
  otpForm: FormGroup;
  countryCode: string = "+91";
  mobile: string = "";

  @ViewChildren("otpInput") otpInputs!: QueryList<IonInput>;

  constructor(
    private fb: FormBuilder,
    private otpService: OtpService,
    private router: Router,
    private loadingController: LoadingController
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
    this.mobile = localStorage.getItem("mobile") || "";
    this.countryCode = localStorage.getItem("countryCode") || "+91";

    if (!this.mobile) {
      alert("No mobile number found! Please log in again.");
      this.router.navigateByUrl("/login");
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const firstInput = this.otpInputs.get(0);
      if (firstInput) {
        firstInput.setFocus();
      }
    }, 300);
  }

  get otpControls() {
    return this.otpForm.get("otpInputs") as FormArray;
  }

  // onInputChange(event: any, index: number) {
  //   const inputValue = event.target.value;

  //   if (inputValue.length === 1 && index < this.otpControls.length - 1) {
  //     const nextInput = this.otpInputs.get(index + 1);
  //     if (nextInput) {
  //       nextInput.setFocus();
  //     }
  //   } else if (inputValue === "" && index > 0) {
  //     const prevInput = this.otpInputs.get(index - 1);
  //     if (prevInput) {
  //       prevInput.setFocus();
  //     }
  //   }
  // }
  onInputChange(event: any, index: number) {
    const inputValue = event.target.value;
    const key = event.inputType; 
  
    if (key === "deleteContentBackward" && index > 0) {
 
      const prevInput = this.otpInputs.get(index - 1);
      if (prevInput) {
        prevInput.setFocus();
      }
    } else if (inputValue.length === 1 && index < this.otpControls.length - 1) {
     
      const nextInput = this.otpInputs.get(index + 1);
      if (nextInput) {
        nextInput.setFocus();
      }
    }
  }
  
  async verify() {
    if (this.otpForm.valid) {
      const loading = await this.loadingController.create({
        spinner: "circles",
        duration: 5000,
      });
      await loading.present();

      const fullMobileNumber = this.countryCode + this.mobile;
      const otp = this.otpControls.value.join("");

      this.otpService.verify({ mobile: fullMobileNumber, otp }).subscribe({
        next: async (response: any) => {
          const token = response.token;
          localStorage.setItem("authToken", token);

          const decodedToken: any = jwtDecode(token);
          localStorage.setItem("userId", decodedToken.id);

          await loading.dismiss();
          this.router.navigateByUrl("/quiz-list");
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
      spinner: "circles",
      duration: 5000,
    });
    await loading.present();

    const fullMobileNumber = this.countryCode + this.mobile;

    if (!this.mobile) {
      alert("No mobile number available to resend OTP.");
      return;
    }

    this.otpService.login(fullMobileNumber).subscribe({
      next: async (response: any) => {
        console.log(response.message);
        console.log(response.otp);
        alert(`OTP sent successfully to ${fullMobileNumber}`);
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
