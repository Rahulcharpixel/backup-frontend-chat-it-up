import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { QuizService } from "src/app/services/quiz.service";

@Component({
  selector: "app-quiz-responses",
  templateUrl: "./quiz-responses.page.html",
  styleUrls: ["./quiz-responses.page.scss"],
})
export class QuizResponsesPage implements OnInit {
  quizId: string | null = null;
  responses: any[] = [];
  quizTitle: string = "Quiz Responses";
  userId: string = localStorage.getItem("userId") || "";
  senderId: string = '';
  data: any[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private quizService: QuizService,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.quizId = paramMap.get("id");
        this.loadResponses();
    });
  }

  loadResponses() {
    if (this.quizId) {
      this.quizService.getQuizResponses(this.quizId).subscribe({
        next: (response) => {
          if (response.success && response.responses && response.responses.length > 0) {
            this.responses = response.responses;
            console.log(this.responses);
          } else {
            console.warn("No responses found for this quiz.");
            this.responses = [];
          }

        },
        error: (error) => {
          console.error("Error fetching quiz responses:", error);
        },
      });
    } else {
      console.warn("Quiz ID is missing. Cannot fetch responses.");
    }
  }

}
// createRoom(): void {
//   this.chatService
//     .createChatRoom(this.userId, this.senderId )
//     .subscribe((response: any) => {
//       console.log('----->>>>',response.chatId);
//       this.router.navigate(['/chat', response.chatId]);
//     });
// }
