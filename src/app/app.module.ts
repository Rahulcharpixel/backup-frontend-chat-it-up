import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { LoginPageModule } from "./pages/login/login.module";
import { OtpVerificationPageModule } from "./pages/otp-verification/otp-verification.module";
import { ReactiveFormsModule } from "@angular/forms";
import { TabsPageModule } from "./pages/tabs/tabs.module";

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// Provide your Socket.IO server URL
const config: SocketIoConfig = { url: 'http://localhost:80', options: {} };

@NgModule({
  declarations: [AppComponent,],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    LoginPageModule,
    OtpVerificationPageModule,
    ReactiveFormsModule,
    TabsPageModule,
    HttpClientModule,
   
    SocketIoModule.forRoot(config)
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy, }],
  bootstrap: [AppComponent],
})
export class AppModule { }
