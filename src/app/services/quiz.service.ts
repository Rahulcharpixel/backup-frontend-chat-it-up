import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { quizStore } from '../store/quiz.store';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = 'http://localhost:80/api';  

  constructor(private http: HttpClient) {}

  getPredefinedSubcategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/predefined-subcategories`);
  }
  
  loadQuizzes(): void {
    this.getAllQuizzes().subscribe({
      next: (response) => {
        quizStore.setQuizzes(response.quizzes);  
      },
      error: (error) => {
        console.error('Error loading quizzes', error);
      }
    });
  }

  addQuiz(quizData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-quiz`, quizData).pipe(
      tap(() => {
        quizStore.setCurrentQuiz(quizData);
        this.loadQuizzes();  
      })
    );
  }

  getAllQuizzes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/quizzes`).pipe(
      tap((response: any) => {
        quizStore.setQuizzes(response.quizzes);  
      })
    );
  }

  getQuizById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/quiz/${id}`).pipe(
      tap((quiz: any) => {
        quizStore.setCurrentQuiz(quiz.quiz); 
      })
    );
  }

  updateQuiz(id: string, quizData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/quiz/${id}`, quizData).pipe(
      tap(() => {
        quizStore.setCurrentQuiz(quizData);
        this.loadQuizzes(); 
      })
    );
  }
  deleteQuiz(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/quiz/${id}`);
  }
}
