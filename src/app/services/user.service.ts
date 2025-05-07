import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { BASE_URL_USER } from '../Constants/baseurls.const';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private apiUrl = 'http://localhost:80/api/user';

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
    return this.http.get(`${BASE_URL_USER}/${userId}`,{ headers });
  }
  deleteAccount(userId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${BASE_URL_USER}/account-delete/${userId}`, { headers });
  }
}