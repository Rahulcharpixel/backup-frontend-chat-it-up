import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuizGroupListPageRoutingModule } from './quiz-group-list-routing.module';
import { QuizGroupListPage } from './quiz-group-list.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizGroupListPageRoutingModule,
    SharedModule
  ],
  declarations: [
    QuizGroupListPage
  ]
})
export class QuizGroupListPageModule { }
