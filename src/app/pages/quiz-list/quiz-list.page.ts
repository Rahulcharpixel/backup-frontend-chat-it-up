import { ChatService } from 'src/app/services/chat.service';
import { Chart } from 'chart.js/auto';
import { Component, model, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { QuizService } from "src/app/services/quiz.service";
import { quizStore } from "src/app/store/quiz.store";
import { ModalController } from "@ionic/angular";
import { FilterComponentComponent } from "./filter-component/filter-component.component";
import { QuizChatListComponent } from "./quiz-chat-list/quiz-chat-list.component";

@Component({
  selector: "app-quiz-list",
  templateUrl: "./quiz-list.page.html",
  styleUrls: ["./quiz-list.page.scss"],
})
export class QuizListPage implements OnInit {
  selectedSegment: string = "default";
  isFilterApplied: boolean = false;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private modalController: ModalController,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.loadQuizzes();
  }

  ionViewWillEnter() {
    console.log("QuizListPage ionViewWillEnter - refreshing group list");
    this.loadGroups();
  }

  loadQuizzes() {
    this.quizService.getAllQuizzes().subscribe((response) => {
      quizStore.setAllQuizzes(response?.quizzes || []);
    });

    this.quizService.getMyQuizzes().subscribe((response) => {
      quizStore.setMyQuizzes(response?.quizzes || []);
    });
  }

  loadGroups() {
    console.log("Loading groups...");
    this.chatService.getGroups().subscribe({
      next: (response: any) => {
        console.log("Groups loaded:", response.groups);
        // Filter out deleted groups as an additional safety measure
        const filteredGroups = response.groups.filter((group: any) => !group.isDeleted);
        console.log("Filtered groups:", filteredGroups);
      },
      error: (err: any) => {
        console.error("Error loading groups:", err);
      }
    });
  }

  doRefresh(event: any) {
    setTimeout(() => {
      if (this.selectedSegment === "default") {
        this.quizService.getAllQuizzes().subscribe({
          next: (response) => {
            quizStore.setAllQuizzes(response?.quizzes || []);
            event.target.complete();
          },
          error: () => event.target.complete(),
        });
      } else {
        this.quizService.getMyQuizzes().subscribe({
          next: (response) => {
            quizStore.setMyQuizzes(response?.quizzes || []);
            event.target.complete();
          },
          error: () => event.target.complete(),
        });
      }
    }, 2000);
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterComponentComponent,
      componentProps: {
        filterApplied: this.isFilterApplied,
        onFilterApplied: () => {
          this.isFilterApplied = true;
        },
      },
    });

    await modal.present();
  }

  async openQuizChatList() {
    this.router.navigate(["/quiz-group-list"]);
  }
  resetFilters() {
    this.isFilterApplied = false;
    this.loadQuizzes();
  }

  onSegmentChange(event: any) {
    this.selectedSegment = event.detail.value;
  }

  get quizStore() {
    return quizStore;
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value;
    if (!searchTerm) {
      this.resetQuizzes();
    } else {
      this.searchQuiz(searchTerm);
    }
  }

  resetQuizzes() {
    if (this.selectedSegment === "default") {
      quizStore.resetAllQuizzes();
    } else {
      quizStore.resetMyQuizzes();
    }
  }

  searchQuiz(searchTerm: string) {
    const lowerTerm = searchTerm.toLowerCase();

    if (this.selectedSegment === "default") {
      quizStore.setAllQuizzes(
        quizStore.originalAllQuizzes.filter((quiz) =>
          quiz.title.toLowerCase().includes(lowerTerm)
        )
      );
    } else {
      quizStore.setMyQuizzes(
        quizStore.originalMyQuizzes.filter((quiz) =>
          quiz.title.toLowerCase().includes(lowerTerm)
        )
      );
    }
  }

  // openChatPage(){
  //   this.router.navigate(['/chat'])
  // }

  gotoQuizQuestion(quizId: string) {
    this.router.navigate(["/quiz-question", quizId]);
  }

  editQuiz(id: string) {
    this.router.navigate([`/edit-quiz/${id}`]);
  }

  deleteQuiz(id: string) {
    if (confirm("Are you sure you want to delete your Quiz?")) {
      this.quizService.deleteQuiz(id).subscribe(() => {
        quizStore.removeQuizFromAllQuizzes(id);
        quizStore.removeQuizFromMyQuizzes(id);
      });
    }
  }

  viewResponses(quizId: string) {
    this.router.navigate(["/quiz-responses", quizId]);
  }
  isMyQuiz(quizId: string): boolean {
    return this.quizStore.myQuizzes.some((myQuiz) => myQuiz._id === quizId);
  }
  onCardClick(quiz: any) {
    if (!this.isMyQuiz(quiz._id)) {
      this.gotoQuizQuestion(quiz._id);
    }
  }

}

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
//   selectedSegment: string = 'default';

//   constructor(private quizService: QuizService, private router: Router) {}

//   ngOnInit() {
//     this.loadQuizzes();
//   }

//   loadQuizzes() {
//     this.quizService.getAllQuizzes().subscribe((response) => {
//       quizStore.setAllQuizzes(response?.quizzes || []);
//     });

//     this.quizService.getMyQuizzes().subscribe((response) => {
//       quizStore.setMyQuizzes(response?.quizzes || []);
//     });
//   }

//   handleRefresh(event: CustomEvent) {
//     setTimeout(() => {

//       (event.target as HTMLIonRefresherElement).complete();
//     }, 5000);
//   }

//   doRefresh(event: any) {
//     setTimeout(() => {
//     if (this.selectedSegment === 'default') {
//       this.quizService.getAllQuizzes().subscribe({
//         next: (response) => {
//           quizStore.setAllQuizzes(response?.quizzes || []);
//           event.target.complete();
//         },
//         error: () => event.target.complete(),
//       });

//     }
//      else {
//       this.quizService.getMyQuizzes().subscribe({
//         next: (response) => {
//           quizStore.setMyQuizzes(response?.quizzes || []);
//           event.target.complete();
//         },
//         error: () => event.target.complete(),
//       });
//     }
//   }
//   ),2000}

// gotoQuizQuestion(quizId: string) {
//   this.router.navigate(['/quiz-question', quizId]);
// }

//   editQuiz(id: string) {
//     this.router.navigate([`/edit-quiz/${id}`]);
//   }

// deleteQuiz(id: string) {
//   if (confirm('Are you sure you want to delete your Quiz?')) {
//     this.quizService.deleteQuiz(id).subscribe(() => {
//       quizStore.removeQuizFromAllQuizzes(id);
//       quizStore.removeQuizFromMyQuizzes(id);
//     });
//   }
// }
