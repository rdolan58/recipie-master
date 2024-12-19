import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardData } from '../models/dashboard-data.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {
  private readonly apiUrl = `${environment.apiUrl}/api/dashboard-data/`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches dashboard data from the API.
   * @returns Observable<DashboardData>
   */
  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching dashboard data:', error);
        // Pass the error to the caller for further handling
        return throwError(() => new Error('Failed to fetch dashboard data.'));
      })
    );
  }
}
