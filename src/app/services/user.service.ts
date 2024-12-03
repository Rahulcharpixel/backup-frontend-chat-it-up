import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:80/api/user';

  constructor(private http: HttpClient) { }


  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded : any = jwtDecode(token);
      return decoded.id;
    }
    return null;
  }

  getUserById(userId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.apiUrl}/${userId}`,{ headers });
  }
  deleteAccount(userId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.apiUrl}/account-delete/${userId}`, { headers });
  }
}