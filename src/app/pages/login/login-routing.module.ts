import { OtpVerificationPageModule } from '../otp-verification/otp-verification.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: 'otp-verification',
    loadChildren: () => import('../otp-verification/otp-verification.module').then(m => m.OtpVerificationPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule { }
