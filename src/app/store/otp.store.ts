import { makeAutoObservable } from 'mobx';

class OtpStore {
  mobile: string = '';
  otpInputs: string[] = Array(4).fill('');
  otp: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setMobile(mobile: string) {
    this.mobile = mobile;
  }

  setOtpInputs(inputs: string[]) {
    this.otpInputs = inputs;
    this.otp = inputs.join('');
  } 

  clear() {
    this.mobile = '';
    this.otpInputs = Array(4).fill('');
    this.otp = '';
  }
}

const otpStore = new OtpStore();
export { otpStore }
