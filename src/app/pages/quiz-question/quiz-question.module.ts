import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizQuestionPageRoutingModule } from './quiz-question-routing.module';

import { QuizQuestionPage } from './quiz-question.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizQuestionPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [QuizQuestionPage]
})
export class QuizQuestionPageModule {}
