import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class QuestionUploadService {

  constructor(private http: HttpClient) { }

  postData(input: any) {
   

  return this.http.post('http://localhost:3000/fibonacci/', input).subscribe(res => {
    return res;
  });

}
}
