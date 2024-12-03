// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { QuizService } from 'src/app/services/quiz.service';
// import { quizStore } from 'src/app/store/quiz.store';

// @Component({
//   selector: 'app-quiz-list',
//   templateUrl: './quiz-list.page.html',
//   styleUrls: ['./quiz-list.page.scss'],
// })
// export class QuizListPage implements OnInit {
//   constructor(private quizService: QuizService, private router: Router) {}

//   ngOnInit() {
//     this.quizService.getMyQuizzes().subscribe((response) => {
//       if (response?.quizzes?.length > 0) {
//         quizStore.setQuizzes(response.quizzes);
//       } else {
//         quizStore.setQuizzes([]);
//       }
//     });
//   }


//   editQuiz(id: string) {
//     this.router.navigate([`/edit-quiz/${id}`])
//   }

//   addQuiz() {
//     this.router.navigate(['/add-quiz']);
//   }

//   deleteQuiz(id: string) {
//     this.quizService.deleteQuiz(id).subscribe(
//       () => {
//         // alert('Quiz deleted successfully');
//         quizStore.setQuizzes(quizStore.quizzes.filter((quiz) => quiz._id !== id));
//       },
//       (error) => {
//         console.error('Error deleting quiz:', error);
//       }
//     );
//   }

//   get quizStore() {
//     return quizStore;
//   }
// }






// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { QuizService } from 'src/app/services/quiz.service';
// import { quizStore } from 'src/app/store/quiz.store';

// @Component({
//   selector: 'app-quiz-list',
//   templateUrl: './quiz-list.page.html',
//   styleUrls: ['./quiz-list.page.scss'],
// })
// export class QuizListPage implements OnInit {
//   selectedSegment: string = 'allQuizzes'; 

//   constructor(private quizService: QuizService, private router: Router) {}

//   ngOnInit() {

//     this.quizService.getAllQuizzes().subscribe((response) => {
//       if (response?.quizzes?.length > 0) {
//         quizStore.setAllQuizzes(response.quizzes);
//       } else {
//         quizStore.setAllQuizzes([]);
//       }
//     });

//     this.quizService.getMyQuizzes().subscribe((response) => {
//       if (response?.quizzes?.length > 0) {
//         quizStore.setMyQuizzes(response.quizzes);
//       } else {
//         quizStore.setMyQuizzes([]);
//       }
//     });
//   }

//   gotoQuizQuestion() {
//     this.router.navigate(['/quiz-question']);
//   }

//   onSearchChange(event: any) {
//     const searchTerm = event.target.value;

//     if (!searchTerm) {
//       if (this.selectedSegment === 'allQuizzes') {
//         quizStore.resetAllQuizzes();
//       } else {
//         quizStore.resetMyQuizzes();
//       }
//     } else {
//       if (this.selectedSegment === 'allQuizzes') {
//         quizStore.setAllQuizzes(
//           quizStore.originalAllQuizzes.filter(quiz => 
//             quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//         );
//       } else {
//         quizStore.setMyQuizzes(
//           quizStore.originalMyQuizzes.filter(quiz => 
//             quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//         );
//       }
//     }
//   }

//   onSegmentChange(event: any) {
//     this.selectedSegment = event.detail.value;
//   }

//   editQuiz(id: string) {
//     this.router.navigate([`/edit-quiz/${id}`]);
//   }

//   deleteQuiz(id: string) {
//     this.quizService.deleteQuiz(id).subscribe(() => {
//       quizStore.removeQuizFromAllQuizzes(id);
//       quizStore.removeQuizFromMyQuizzes(id);
//     });
//   }

//   get quizStore() {
//     return quizStore;
//   }
// }





import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { QuizService } from 'src/app/services/quiz.service';
import { quizStore } from 'src/app/store/quiz.store';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.page.html',
  styleUrls: ['./quiz-list.page.scss'],
})
export class QuizListPage implements OnInit {
  selectedSegment: string = 'default'; 

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit() {
    this.quizService.getAllQuizzes().subscribe((response) => {
      quizStore.setAllQuizzes(response?.quizzes || []);
    });

    this.quizService.getMyQuizzes().subscribe((response) => {
      quizStore.setMyQuizzes(response?.quizzes || []);
    });
  }

  gotoQuizQuestion(quizId: string) {
    this.router.navigate(['/quiz-question',quizId]);
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value;

    if (!searchTerm) {
      if (this.selectedSegment === 'default') {
        quizStore.resetAllQuizzes();
      } else {
        quizStore.resetMyQuizzes();
      }
    } else {
      if (this.selectedSegment === 'default') {
        quizStore.setAllQuizzes(
          quizStore.originalAllQuizzes.filter((quiz) =>
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      } else {
        quizStore.setMyQuizzes(
          quizStore.originalMyQuizzes.filter((quiz) =>
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
    }
  }

  onSegmentChange(event: any) {
    this.selectedSegment = event.detail.value;
  }

  editQuiz(id: string) {
    this.router.navigate([`/edit-quiz/${id}`]);
  }

  deleteQuiz(id: string) {
    this.quizService.deleteQuiz(id).subscribe(() => {
      quizStore.removeQuizFromAllQuizzes(id);
      quizStore.removeQuizFromMyQuizzes(id);
    });
  }
  get quizStore() {
    return quizStore;
  }
  // checkResponse(quizId: string) {
  //   this.quizService.getMyQuizzes().subscribe({
  //     next: (response) => {
  //       console.log('User answer:', response);
        
  //     },
  //     error: (error) => {
  //       console.error('Error fetching answer:', error);
        
  //     },
  //   });
  //   this.router.navigate(['/quiz-responses', quizId]);
  // }
  
  checkResponse(quizId: string) {
    if (!quizId) {
      console.error('Quiz ID is missing.');
      return;
    }
    
    this.quizService.getQuizResponses(quizId).subscribe({
      next: (response) => {
        // console.log('User answer:', response);
      },
      error: (error) => {
        console.error('Error fetching answer:', error);
      },
    });
  
    this.router.navigate(['/quiz-responses', quizId]);
  }
  onIonInfinite(event:any) {
    this.quizService.getAllQuizzes().subscribe((response) => {
      quizStore.setAllQuizzes(response?.quizzes || []);
    });

    this.quizService.getMyQuizzes().subscribe((response) => {
      quizStore.setMyQuizzes(response?.quizzes || []);
    });
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 5000);
  }
}
