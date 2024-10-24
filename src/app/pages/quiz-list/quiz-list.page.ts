import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';
import { quizStore } from 'src/app/store/quiz.store';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.page.html',
  styleUrls: ['./quiz-list.page.scss'],
})
export class QuizListPage implements OnInit {
  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit() {
    this.quizService.getAllQuizzes().subscribe((quizzes) => {
      quizStore.setQuizzes(quizzes);
    });
  }

  updateQuiz(id: string) {
    // console.log(id);
    this.router.navigate([`/add-quiz/${id}`]);
  }

  addQuiz() {
    this.router.navigate(['/add-quiz']);
  }

  deleteQuiz(id: string) {
    this.quizService.deleteQuiz(id).subscribe(
      () => {
        // alert('Quiz deleted successfully');
        quizStore.setQuizzes(quizStore.quizzes.filter((quiz) => quiz._id !== id));
      },
      (error) => {
        console.error('Error deleting quiz:', error);
      }
    );
  }

  get quizStore() {
    return quizStore;
  }
}
