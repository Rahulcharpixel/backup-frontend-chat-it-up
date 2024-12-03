import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizResponsesPageRoutingModule } from './quiz-responses-routing.module';

import { QuizResponsesPage } from './quiz-responses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizResponsesPageRoutingModule
  ],
  declarations: [QuizResponsesPage]
})
export class QuizResponsesPageModule {}
