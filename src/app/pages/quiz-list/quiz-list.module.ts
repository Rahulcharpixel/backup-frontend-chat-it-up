import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizListPageRoutingModule } from './quiz-list-routing.module';

import { QuizListPage } from './quiz-list.page';
import { IonModal } from '@ionic/angular/common';
import { FilterComponentComponent } from './filter-component/filter-component.component';
import { QuizChatListComponent } from './quiz-chat-list/quiz-chat-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizListPageRoutingModule,
    
    
  ],
  declarations: [QuizListPage,FilterComponentComponent,QuizChatListComponent]
})
export class QuizListPageModule {}
