import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { quizStore } from "../store/quiz.store";
import { BASE_URL } from "../Constants/baseurls.const";

@Injectable({
  providedIn: "root",
})
export class QuizService {
  // private apiUrl = "http://localhost:80/api";

  constructor(private http: HttpClient) { }

  getPredefinedSubcategories(): Observable<any> {
    return this.http.get(`${BASE_URL}/predefined-subcategories`);
  }

  loadAllQuizzes(): void {
    this.getAllQuizzes().subscribe({
      next: (response) => {
        quizStore.setAllQuizzes(response.quizzes);
      },
      error: (error) => {
        console.error("Error loading all quizzes", error);
      },
    });
  }

  loadMyQuizzes(): void {
    this.getMyQuizzes().subscribe({
      next: (response) => {
        quizStore.setMyQuizzes(response.quizzes);
      },
      error: (error) => {
        console.error("Error loading my quizzes", error);
      },
    });
  }

  addQuiz(quizData: any): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http
      .post(`${BASE_URL}/add-quiz`, quizData, { headers })
      .pipe(
        tap(() => {
          quizStore.setCurrentQuiz(quizData);
          this.loadMyQuizzes();
          this.loadAllQuizzes();
        })
      );
  }

  getMyQuizzes(): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.get(`${BASE_URL}/my-quizzes`, { headers }).pipe(
      tap((response: any) => {
        quizStore.setMyQuizzes(response.quizzes);
      })
    );
  }

  getAllQuizzes(): Observable<any> {
    return this.http.get(`${BASE_URL}/quizzes`).pipe(
      tap((response: any) => {
        quizStore.setAllQuizzes(response.quizzes);
      })
    );
  }

  getFilteredQuizzes(filterType?: string, subcategory?: string): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    
    let url = `${BASE_URL}/filter-quiz`;
    const params = new URLSearchParams();
  
    if (filterType) {
      params.append("filterType", filterType);
    }
    if (subcategory) {
      params.append("subcategory", subcategory);
    }
  
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  
    return this.http.get(url, { headers }).pipe(
      tap((response: any) => {
        quizStore.setAllQuizzes(response.quizzes);
      })
    );
  }
  getResponseStats(id:string): Observable<any>{
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.get(`${BASE_URL}/quiz-response-stats/${id}`,{ headers })
  }

  getQuizById(id: string): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.get(`${BASE_URL}/quiz/${id}`, { headers }).pipe(
      tap((quiz: any) => {
        quizStore.setCurrentQuiz(quiz.quiz);
      })
    );
  }
  submitQuizAnswer(id: string, answerData: any): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.post(`${BASE_URL}/answer-quiz/${id}`, answerData, {
      headers,
    });
  }

  getUserAnswer(id: string): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.get(`${BASE_URL}/quiz-answer/${id}`, { headers });
  }
  deleteAnswer(id: string): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.delete(`${BASE_URL}/delete-quizAnswer/${id}`, {
      headers,
    });
  }

  getQuizResponses(id: string): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.get(`${BASE_URL}/quiz-response/${id}`, { headers });
  }

  editQuiz(id: string, quizData: any): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http
      .put(`${BASE_URL}/edit-quiz/${id}`, quizData, { headers })
      .pipe(
        tap(() => {
          quizStore.setCurrentQuiz(quizData);
          this.loadMyQuizzes();
        })
      );
  }

  deleteQuiz(id: string): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http
      .delete(`${BASE_URL}/delete-quiz/${id}`, { headers })
      .pipe(
        tap(() => {
          quizStore.removeQuizFromMyQuizzes(id);
          quizStore.removeQuizFromAllQuizzes(id);
        })
      );
  }

  searchQuizzes(query: string): Observable<any> {
    return this.http.get(`${BASE_URL}/quizzes/search?q=${query}`).pipe(
      tap((response: any) => {
        quizStore.setAllQuizzes(response.quizzes);
      })
    );
  }

  sendChatRequest(data: {
    senderId: string;
    receiverId: string;
  }): Observable<any> {
    const token = localStorage.getItem("authToken");
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.post(`${BASE_URL}/chat-request`, data, { headers });
  }
}
