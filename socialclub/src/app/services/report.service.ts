// report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'http://localhost:8000/api/report/';

  constructor(private http: HttpClient) {}

  submitReport(reportData: any): Observable<any> {
    return this.http.post(this.baseUrl, reportData)
      .pipe(
        catchError(error => {
          console.error('Error submitting report:', error);
          throw error; // Re-throw the error to propagate it to the caller
        })
      );
  }
}
