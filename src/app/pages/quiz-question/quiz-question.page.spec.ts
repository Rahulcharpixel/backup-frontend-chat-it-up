import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizQuestionPage } from './quiz-question.page';

describe('QuizQuestionPage', () => {
  let component: QuizQuestionPage;
  let fixture: ComponentFixture<QuizQuestionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizQuestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
