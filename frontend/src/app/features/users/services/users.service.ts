import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfileRequest, UserProfileResponse } from '../../../models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl = 'http://localhost:8080/api/users';

  constructor(private readonly http: HttpClient) {}

  listUsers(): Observable<UserProfileResponse[]> {
    return this.http.get<UserProfileResponse[]>(this.baseUrl);
  }

  getUser(id: number): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.baseUrl}/${id}`);
  }

  createUser(payload: UserProfileRequest): Observable<UserProfileResponse> {
    return this.http.post<UserProfileResponse>(this.baseUrl, payload);
  }

  updateUser(id: number, payload: UserProfileRequest): Observable<UserProfileResponse> {
    return this.http.put<UserProfileResponse>(`${this.baseUrl}/${id}`, payload);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
