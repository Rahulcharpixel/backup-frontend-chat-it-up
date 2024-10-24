import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatRequestPage } from './chat-request.page';

describe('ChatRequestPage', () => {
  let component: ChatRequestPage;
  let fixture: ComponentFixture<ChatRequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
