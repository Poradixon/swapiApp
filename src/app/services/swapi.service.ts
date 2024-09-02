import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SwapiService {
  private apiUrl = "https://www.swapi.tech/api";
  private readonly PEOPLE_COUNT = 82;
  private readonly STARSHIPS_COUNT = 29;
  // private readonly MAX_RETRY_COUNT = 5;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getResource(resource: string): Observable<any> {
    const maxId = this.getMaxIdForResource(resource);
    const randomId = this.getRandomId(maxId);

    return this.retryRequest(resource, randomId);
  }

  private getMaxIdForResource(resource: string): number {
    return resource === "people" ? this.PEOPLE_COUNT : this.STARSHIPS_COUNT;
  }

  /*
        I considered modifying the `getRandomId` function to only return IDs that correspond to valid responses for starships. 
        This change would be aligned with the implementation specifics of the API. 
        However, I opted not to make this adjustment as it would defeat the purpose of having a truly random ID—after all, 
        who doesn’t enjoy a bit of unpredictability?
      */
  private getRandomId(maxId: number): number {
    return Math.floor(Math.random() * maxId) + 1;
  }

  private retryRequest(resource: string, randomId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${resource}/${randomId}`).pipe(
      /*
        Initially, I attempted to implement a retry mechanism for handling failed requests. 
        However, after further consideration, I decided that it is more appropriate to notify the user 
        when a request fails and suggest that they try again. This approach ensures a more user-friendly 
        experience by providing immediate feedback and guidance.
      */

      // retryWhen((errors) =>
      //   errors.pipe(
      //     switchMap((error: HttpErrorResponse) => {
      //       if (error.status === 404) {
      //         const newId = this.getRandomId(maxId);
      //         return of(newId);
      //       }
      //       return throwError(error);
      //     }),
      //     switchMap((newId) => {
      //       return this.http.get(`${this.apiUrl}/${resource}/${newId}`);
      //     }),
      //     delay(500),
      //     take(this.MAX_RETRY_COUNT)
      //   )
      // ),
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error("An error occurred:", error.message);
    this.snackBar.open("Request failed, please try again.", "Close", {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "top",
    });
    return throwError("Something bad happened, please try again later.");
  }
}
