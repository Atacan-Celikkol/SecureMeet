import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class DataService<TResponse, TRequest> {
   private baseUrl = environment.baseUrl;
   constructor(protected http: HttpClient) {
   }

   get(path: string, id: string): Observable<TResponse[]> {
      return this.http.get<TResponse[]>(`${this.baseUrl + path}/${id}`).pipe();
   }

   getAll(path: string): Observable<TResponse[]> {
      return this.http.get<TResponse[]>(this.baseUrl + path).pipe();
   }

   put(path: string, id: string, data: TRequest): Observable<TResponse[]> {
      return this.http.put<TResponse[]>(`${this.baseUrl + path}/${id}`, JSON.stringify(data)).pipe();
   }

   post(path: string, data: TRequest): Observable<TResponse[]> {
      return this.http.post<TResponse[]>(this.baseUrl + path, JSON.stringify(data)).pipe();
   }

}
