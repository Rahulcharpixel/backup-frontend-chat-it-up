import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddQuizPageRoutingModule } from './add-quiz-routing.module';

import { AddQuizPage } from './add-quiz.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddQuizPageRoutingModule
  ],
  declarations: [AddQuizPage]
})
export class AddQuizPageModule {}
