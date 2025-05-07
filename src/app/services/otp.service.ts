// import { BASE_URL } from './../Constants/baseurls.const';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { BASE_URL, BASE_URL_VERIFY } from "../Constants/baseurls.const";

@Injectable({
  providedIn: "root",
})
export class OtpService {
  // private baseUrl = "http://localhost:80/api";

  constructor(private http: HttpClient) { }

  registerUser(name: string, email: string, mobile: string): Observable<any> {
    return this.http.post(`${BASE_URL}/register`, { name, email, mobile });
  }

  login(mobile: string): Observable<any> {
    return this.http.post(`${BASE_URL}/login`, { mobile });
  }
  updateUserProfile(id: string, data: any) {
    return this.http.put(`${BASE_URL}/edit-profile/${id}`, data);
  }
  verify(data: { mobile: string; otp: string }) {
    return this.http.post(BASE_URL_VERIFY, data);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("authToken");
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true; 
    }
  }
  getAllUsers(): Observable<any> {
    return this.http.get(`${BASE_URL}/users`);
  }
  getUser(): Observable<any> {
    return this.http.get(`${BASE_URL}/user`);
  }
}
