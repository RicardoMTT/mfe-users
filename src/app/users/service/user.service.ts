import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, shareReplay, throwError } from "rxjs";
import { User, UserResponse } from "../model/user.interface";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly API_URL = 'https://reqres.in/api/users';
  private readonly http = inject(HttpClient);

  getUsers(page: number = 1): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}?page=${page}`).pipe(
      shareReplay(1),
      catchError(this.handleError)
    );
  }


  getUser(id: number): Observable<User> {
    return this.http.get<{data: User}>(`${this.API_URL}/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.API_URL, user).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }


}
