import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
        private fb: FormBuilder,
    ) {
        this.quizForm = this.fb.group({
            title: ['', Validators.required],
            // subcategories : ['', Validators.required],
            quizquestion: ['', Validators.required],
            smallTestAnswer: ['', Validators.required]
        })
    }

    ngOnInit() {
        this.quizId = this.activatedRoute.snapshot.paramMap.get('id');
        if (this.quizId) {
            this.loadQuiz();
        }
        this.loadPredefinedSubcategories();
    }

    get quizStore() {
        return quizStore;
    }

    loadQuiz() {
        this.quizService.getQuizById(this.quizId!).subscribe();
    }

    loadPredefinedSubcategories() {
        this.quizService.getPredefinedSubcategories().subscribe((response) => {
            this.predefinedSubcategories = response.subcategories;
        });
    }

    onSubmit() {
        // if (this.quizForm.valid) {
            if (this.quizId) {
                this.quizService.updateQuiz(this.quizId!, quizStore.currentQuiz).subscribe(
                    () => {
                        alert('Quiz updated successfully');
                        this.router.navigate(['/quiz-list']);
                    },
                    (error) => {
                        console.error('Error updating quiz:', error);
                    }
                );
            } else {
                this.quizService.addQuiz(quizStore.currentQuiz).subscribe(
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
    // }
}
