import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddQuizPage } from './add-quiz.page';

describe('AddQuizPage', () => {
  let component: AddQuizPage;
  let fixture: ComponentFixture<AddQuizPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
