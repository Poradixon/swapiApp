import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class SwapiService {
  private apiUrl = "https://www.swapi.tech/api";
  private readonly PEOPLE_COUNT = 82;
  private readonly STARSHIPS_COUNT = 29;

  constructor(private http: HttpClient) {}

  getResource(resource: string): Observable<any> {
    const maxId =
      resource === "people" ? this.PEOPLE_COUNT : this.STARSHIPS_COUNT;

    const randomId = Math.floor(Math.random() * maxId) + 1;

    return this.http.get(`${this.apiUrl}/${resource}/${randomId}`);
  }
}
