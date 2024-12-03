import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizResponsesPage } from './quiz-responses.page';

const routes: Routes = [
  {
    path: '',
    component: QuizResponsesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizResponsesPageRoutingModule {}
