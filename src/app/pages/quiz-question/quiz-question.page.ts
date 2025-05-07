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
  quizId: string | null = null;
  userId: string | null = null;
  userHasAnswered = false;
  options: any[] = [];
  quizOwnerId: string | null = null;
  selectedAnswer: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.quizForm = this.fb.group({
      answer: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.route.paramMap.subscribe((params) => {
      this.quizId = params.get('id');

      if (this.quizId) {
        this.loadQuiz();
        this.loadUserAnswer();
      }
    });
  }

  get quizStore() {
    return quizStore;
  }

  loadQuiz() {
    if (!this.quizId) {
      console.error('Quiz ID is null or undefined');
      return;
    }
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (response) => {
        if (response && response.quiz) {
          quizStore.setCurrentQuiz(response.quiz);
          this.options = toJS(quizStore.currentQuiz.options) || [];
          this.quizOwnerId = response.quiz.userId;
        } else {
          console.error('No quiz data found for ID:', this.quizId);
        }
      },
      error: (err) => {
        console.error('Error loading quiz:', err);
      },
    });
  }

  loadUserAnswer() {
    if (!this.quizId || !this.userId) {
      console.error('Quiz ID or User ID is missing');
      return;
    }

    this.quizService.getUserAnswer(this.quizId).subscribe({
      next: (response) => {
        console.log("----->>><><><<", response.data);
        if (response && response.data && response.data.selectedOption) {
          this.userHasAnswered = true;
          this.quizForm.patchValue({ answer: response.data.selectedOption });


          setTimeout(() => {
            this.quizForm.disable();
          }, 0);
        } else {
          this.userHasAnswered = false;
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.userHasAnswered = false;
        } else {
          console.error('Error loading user answer:', err);
        }
      },
    });
  }



  onSubmit() {
    if (this.quizForm.invalid || this.userHasAnswered || this.userId === this.quizOwnerId) {
      alert("You cannot answer your own quiz or submit an invalid answer.");
      return;
    }

    const answerData = {
      selectedOption: this.quizForm.value.answer,
      answers: {
        selectedOption: this.quizForm.value.answer
      }
    };

    if (!this.quizId) return;

    this.quizService.submitQuizAnswer(this.quizId, answerData).subscribe({
      next: (response) => {
        alert(response.message || 'Answer submitted successfully! You have joined the quiz room.');
        this.userHasAnswered = true;
        this.selectedAnswer = answerData.selectedOption;
        this.quizForm.disable();
      },
      error: (err) => {
        alert(err.error?.error || 'Error submitting answer.');
        console.error('Error submitting answer:', err);
      },
    });
  }


  deleteAnswer() {
    if (confirm('Are you sure you want to delete your Answer?')) {
      if (!this.quizId) {
        console.error('Quiz ID is null or undefined');
        return;
      }
      this.quizService.deleteAnswer(this.quizId).subscribe({
        next: () => {
          this.userHasAnswered = false;
          this.quizForm.reset();
          this.quizForm.enable();
          alert('Answer deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting answer:', err);
        },
      });
    }
  }
}

