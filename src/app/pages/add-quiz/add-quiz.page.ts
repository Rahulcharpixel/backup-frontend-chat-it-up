import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';
import { quizStore } from 'src/app/store/quiz.store';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.page.html',
  styleUrls: ['./add-quiz.page.scss'],
})
export class AddQuizPage implements OnInit {
  quizId: string | null = null;
  predefinedSubcategories: string[] = [];
  quizForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private quizService: QuizService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      quizquestion: ['', Validators.required],
      questionType: ['text', Validators.required],
      options: this.fb.array([]), 
    });
  }

  ngOnInit() {
    this.quizId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log("--->>>>>",this.quizId);
    if (this.quizId) {
      this.loadQuiz();
    }
    this.loadPredefinedSubcategories();


    this.quizForm.get('questionType')?.valueChanges.subscribe((value) => {
      if (value === 'mcq') {
        this.initializeDefaultOptions();
      } else {
        this.clearOptions();
      }
    });
  
  }
  initializeDefaultOptions() {
    if (this.options.length === 0) {
      this.options.push(this.fb.control('', Validators.required));
      this.options.push(this.fb.control('', Validators.required));
    }
  }
  
  clearOptions() {
    while (this.options.length !== 0) {
      this.options.removeAt(0);
    }
  }
 

  get options(): FormArray {
    return this.quizForm.get('options') as FormArray;
  }

  loadQuiz() {
    this.quizService.getQuizById(this.quizId!).subscribe((response) => {
      const quiz = response.quiz;

      this.quizForm.patchValue({
        title: quiz.title,
        quizquestion: quiz.quizquestion,
        questionType: quiz.questionType,
      });

      if (quiz.questionType === 'mcq' && quiz.options) {
        quiz.options.forEach((opt: { option: string }) => {
          this.options.push(this.fb.control(opt.option, Validators.required));
        });
      }

      quizStore.setCurrentQuiz(quiz);
    });
  }

  loadPredefinedSubcategories() {
    this.quizService.getPredefinedSubcategories().subscribe((response) => {
      this.predefinedSubcategories = response.subcategories;
    });
  }

  addOption() {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }
  get quizStore() {
    return quizStore;
}
onSubmit() {
  if (this.quizForm.invalid) return;

  const formData = this.quizForm.value;
  const quizData = {
    title: formData.title,
    quizquestion: formData.quizquestion,
    questionType: formData.questionType,
    subcategories: this.quizStore.currentQuiz.subcategories, 
    options: formData.questionType === 'mcq' ? formData.options.map((opt: string) => ({ option: opt })) : undefined,
  };

  if (this.quizId) {
    this.quizService.editQuiz(this.quizId, quizData).subscribe(
      () => {
        alert('Quiz updated successfully');
        this.router.navigate(['/quiz-list']);
      },
      (error) => {
        console.error('Error updating quiz:', error);
      }
    );
  } else {
    this.quizService.addQuiz(quizData).subscribe(
      () => {
        alert('Quiz added successfully');
        this.router.navigate(['/quiz-list']);
      },
      (error) => {
        console.error('Error adding quiz:', error);
      }
    );
  }
}

}
