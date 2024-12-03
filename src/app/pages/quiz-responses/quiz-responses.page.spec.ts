import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizResponsesPage } from './quiz-responses.page';

describe('QuizResponsesPage', () => {
  let component: QuizResponsesPage;
  let fixture: ComponentFixture<QuizResponsesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizResponsesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
