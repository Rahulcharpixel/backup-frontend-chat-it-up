import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizGroupListPage } from './quiz-group-list.page';

describe('QuizGroupListPage', () => {
  let component: QuizGroupListPage;
  let fixture: ComponentFixture<QuizGroupListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizGroupListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
