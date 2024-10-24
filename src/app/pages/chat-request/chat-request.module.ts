import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatRequestPageRoutingModule } from './chat-request-routing.module';

import { ChatRequestPage } from './chat-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatRequestPageRoutingModule
  ],
  declarations: [ChatRequestPage]
})
export class ChatRequestPageModule {}
