import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfileResponse } from '../models/user-profile.model';
import { BASE_URL } from '../Constants/baseurls.const';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  // private apiUrl = 'http://localhost:80/api';

  constructor(private http: HttpClient) {}

  getUserProfile(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${BASE_URL}/user/${id}`,{headers});
  }

  updateUserProfile(id: string, data: any): Observable<UserProfileResponse> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<UserProfileResponse>(`${BASE_URL}/edit-profile/${id}`, data,{headers});
  }
}
