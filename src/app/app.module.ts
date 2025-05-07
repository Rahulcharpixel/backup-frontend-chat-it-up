import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { LoginPageModule } from "./pages/login/login.module";
import { OtpVerificationPageModule } from "./pages/otp-verification/otp-verification.module";
import { ReactiveFormsModule } from "@angular/forms";

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: '', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    LoginPageModule,
    OtpVerificationPageModule,
    ReactiveFormsModule,
    HttpClientModule,

    SocketIoModule.forRoot(config)
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy, }],
  bootstrap: [AppComponent],
})
export class AppModule { }
