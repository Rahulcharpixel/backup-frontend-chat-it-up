import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizQuestionPage } from './quiz-question.page';

const routes: Routes = [
  {
    path: '',
    component: QuizQuestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizQuestionPageRoutingModule {}
