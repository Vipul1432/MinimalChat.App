import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { giphy } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GiphyService {
  private apiKey: string = giphy.apiKey;
  private apiUrl: string = giphy.url;

  constructor(private http: HttpClient) { }

  searchGifs(query: string, limit: number = 10): Observable<any> {
    const params = {
      api_key: this.apiKey,
      q: query,
      limit: limit.toString()
    };
    return this.http.get(this.apiUrl, { params });
  }
}
