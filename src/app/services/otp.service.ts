import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private baseUrl = 'http://localhost:80/api';

  constructor(private http: HttpClient) { }


  registerUser(name: string, email: string, mobile: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { name, email, mobile });
  }

  login(mobile: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { mobile });
  }


  verify(data: { mobile: string; otp: string }) {
    return this.http.post('http://localhost/api/verify', data);
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('mobile');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;  
  }
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }
}

