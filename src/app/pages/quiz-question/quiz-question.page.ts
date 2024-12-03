import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';
import { quizStore } from 'src/app/store/quiz.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toJS } from 'mobx';

@Component({
  selector: 'app-quiz-question',
  templateUrl: './quiz-question.page.html',
  styleUrls: ['./quiz-question.page.scss'],
})
export class QuizQuestionPage implements OnInit {
  quizForm: FormGroup;
  userId: string | null = null;
  userHasAnswered = false;
  options: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.quizForm = this.fb.group({
      answer: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      // console.log("----->>>>>",this.userId)
      if (this.userId) {
        this.loadQuiz();
        this.loadUserAnswer();
      }
    });
  }

  get quizStore() {
    return quizStore;
  }

  loadQuiz() {
    if (!this.userId) {
      console.error('Quiz ID is null or undefined');
      return;
    }
    this.quizService.getQuizById(this.userId).subscribe({
      next: (response) => {
        if (response && response.quiz) {
          quizStore.setCurrentQuiz(response.quiz);
          // console.log('Quiz loaded:', quizStore.currentQuiz);
          this.options = toJS(quizStore.currentQuiz.options) || []; 
          console.log('--->>>>>>>>>>>>>>>>',this.options);
        } else {
          console.error('No quiz data found for ID:', this.userId);
        }
      },
      error: (err) => {
        console.error('Error loading quiz:', err);
      },
    });
  }
  // loadQuiz() {
  //   if (!this.userId) {
  //     console.error('Quiz ID is null or undefined');
  //     return;
  //   }
  //   this.quizService.getQuizById(this.userId).subscribe({
  //     next: (response) => {
  //       if (response && response.quiz) {
  //         quizStore.setCurrentQuiz(response.quiz);
  //         console.log('Quiz loaded:', quizStore.currentQuiz);
  //       } else {
  //         console.error('No quiz data found for ID:', this.userId);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error loading quiz:', err);
  //     },
  //   });
  // }


  loadUserAnswer() {
    if (!this.userId) {
      console.error('User ID is null or undefined');
      return;
    }
    this.quizService.getUserAnswer(this.userId).subscribe({
      next: (response) => {
        this.userHasAnswered = true;
        this.quizForm.patchValue({ answer: response.answer });
        this.quizForm.disable();
        // console.log('User answer loaded:', response.answer);
      },
      error: (err) => {
        if (err.status !== 404) {
          console.error('Error loading user answer:', err);
        } else {
          console.log('No previous answer found for user');
        }
      },
    });
  }
  



  onSubmit() {
    if (this.quizForm.invalid || this.userHasAnswered) {
      return;
    }

   const answerData = {
       answers: this.quizForm.value.answer,
    };

    if (!this.userId) return;
    this.quizService.submitQuizAnswer(this.userId, answerData).subscribe({
      next: () => {
        alert('Answer submitted successfully!');
        this.userHasAnswered = true;
        this.quizForm.disable();
        this.router.navigate(['/quiz-list']);
      },
      error: (err) => {
        console.error('Error submitting answer:', err);
      },
    });
  }
}