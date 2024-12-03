import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';
import { quizStore } from 'src/app/store/quiz.store';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  // users: any[] = [];
  // quizzes = quizStore.myQuizzes; 

  constructor(private quizService: QuizService) {}

  ngOnInit() {
    // this.quizService.getAllQuizzes()
  }

  // onSearchChange(event: any): void {
  //   const query = event.target.value;
  //   if (query) {
  //     this.quizService.searchQuizzes(query).subscribe();
  //   } else {
  //     this.quizService.getAllQuizzes();
  //   }
  // }
}

