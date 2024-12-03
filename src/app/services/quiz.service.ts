// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';
// import { quizStore } from '../store/quiz.store';

// @Injectable({
//   providedIn: 'root',
// })
// export class QuizService {
//   private apiUrl = 'http://localhost:80/api';

//   constructor(private http: HttpClient) { }

//   getPredefinedSubcategories(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/predefined-subcategories`);
//   }

//   loadQuizzes(): void {
//     this.getAllQuizzes().subscribe({
//       next: (response) => {
//         quizStore.setQuizzes(response.quizzes);
//       },
//       error: (error) => {
//         console.error('Error loading quizzes', error);
//       }
//     });
//   }

//   addQuiz(quizData: any): Observable<any> {
//     const token = localStorage.getItem('authToken');
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
//     return this.http.post(`${this.apiUrl}/add-quiz`, quizData,{headers}).pipe(
//       tap(() => {
//         quizStore.setCurrentQuiz(quizData);
//         this.loadQuizzes();
//       })
//     );
//   }

//   getMyQuizzes(): Observable<any> {
//     const token = localStorage.getItem('authToken');
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.get(`${this.apiUrl}/quizzes`,{headers}).pipe(
//       tap((response: any) => {
//         quizStore.setQuizzes(response.quizzes);
//       })
//     );
//   }
//   getAllQuizzes(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/quizzes`).pipe(
//       tap((response: any) => {
//         quizStore.setQuizzes(response.quizzes);
//       })
//     );
//   }

//   getQuizById(id: string): Observable<any> {
//     return this.http.get(`${this.apiUrl}/quiz/${id}`).pipe(
//       tap((quiz: any) => {
//         quizStore.setCurrentQuiz(quiz.quiz);
//       })
//     );
//   }

//   editQuiz(id: string, quizData: any): Observable<any> {
//     const token = localStorage.getItem('authToken');
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.put(`${this.apiUrl}/edit-quiz/${id}`, quizData,{headers}).pipe(
//       tap(() => {
//         quizStore.setCurrentQuiz(quizData);
//         this.loadQuizzes();
//       })
//     );
//   }
//   deleteQuiz(id: string): Observable<any> {
//     const token = localStorage.getItem('authToken');
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.delete(`${this.apiUrl}/delete-quiz/${id}`,{headers});
//   }

//   searchQuizzes(query: string): Observable<any> {
//     return this.http.get(`${this.apiUrl}/quizzes/search?q=${query}`).pipe(
//       tap((response: any) => {
//         quizStore.setQuizzes(response.quizzes);
//       })
//     );
//   }
// }




import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  loadAllQuizzes(): void {
    this.getAllQuizzes().subscribe({
      next: (response) => {
        quizStore.setAllQuizzes(response.quizzes); 
      },
      error: (error) => {
        console.error('Error loading all quizzes', error);
      },
    });
  }

  loadMyQuizzes(): void {
    this.getMyQuizzes().subscribe({
      next: (response) => {
        quizStore.setMyQuizzes(response.quizzes); 
      },
      error: (error) => {
        console.error('Error loading my quizzes', error);
      },
    });
  }

  addQuiz(quizData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/add-quiz`, quizData, { headers }).pipe(
      tap(() => {
        quizStore.setCurrentQuiz(quizData);
        this.loadMyQuizzes();  
        this.loadAllQuizzes(); 
      })
    );
  }

  getMyQuizzes(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/my-quizzes`, { headers }).pipe(
      tap((response: any) => {
        quizStore.setMyQuizzes(response.quizzes);  
      })
    );
  }

  getAllQuizzes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/quizzes`).pipe(
      tap((response: any) => {
        quizStore.setAllQuizzes(response.quizzes); 
      })
    );
  }

  getQuizById(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/quiz/${id}`,{headers}).pipe(
      tap((quiz: any) => {
        quizStore.setCurrentQuiz(quiz.quiz);
      })
    );
  }
  submitQuizAnswer(id: string, answerData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/answer-quiz/${id}`, answerData, { headers });
  }

  getUserAnswer(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/quiz-answer/${id}`, { headers });
  }
  getQuizResponses(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/quiz-response/${id}`, { headers });
  }
  
  editQuiz(id: string, quizData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/edit-quiz/${id}`, quizData, { headers }).pipe(
      tap(() => {
        quizStore.setCurrentQuiz(quizData);
        this.loadMyQuizzes();  
      })
    );
  }

  deleteQuiz(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/delete-quiz/${id}`, { headers }).pipe(
      tap(() => {
        quizStore.removeQuizFromMyQuizzes(id);  
        quizStore.removeQuizFromAllQuizzes(id); 
      })
    );
  }

  searchQuizzes(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/quizzes/search?q=${query}`).pipe(
      tap((response: any) => {
        quizStore.setAllQuizzes(response.quizzes); 
      })
    );
  }
}
