import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizGroupListPage } from './quiz-group-list.page';

const routes: Routes = [
  {
    path: '',
    component: QuizGroupListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizGroupListPageRoutingModule { }
