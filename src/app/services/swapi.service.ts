import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SwapiService {
  private apiUrl = 'https://www.swapi.tech/api';
  //   private readonly PEOPLE_COUNT = 82; // Liczba osób
  //   private readonly STARSHIPS_COUNT = 37; // Liczba statków kosmicznych

  //     const maxId =
  //       resource === 'people' ? this.PEOPLE_COUNT : this.STARSHIPS_COUNT;
  //     const randomId = Math.floor(Math.random() * maxId) + 1; // Losowanie ID w odpowiednim zakresie
  //     const url = `${this.BASE_URL}/${resource}/${randomId}`;

  constructor(private http: HttpClient) {}

  getRandomPerson(): Observable<any> {
    const randomId = Math.floor(Math.random() * 83) + 1;
    return this.http.get(`${this.apiUrl}/people/${randomId}`);
  }

  getRandomStarship(): Observable<any> {
    const randomId = Math.floor(Math.random() * 36) + 1;
    return this.http.get(`${this.apiUrl}/starships/${randomId}`);
  }
}
