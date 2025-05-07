import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GroupMembersComponent } from '../pages/chat/component/group-members/group-members.component';

@NgModule({
  declarations: [
    GroupMembersComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    GroupMembersComponent
  ]
})
export class SharedModule { }
