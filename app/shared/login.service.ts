import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";

import { User } from "./user.model";
import { BackendService } from "./backend.service";
import { DatabaseService } from "./sqlite.service";

@Injectable()
export class LoginService {
  constructor(private http: HttpClient, private database: DatabaseService) { }

  register(user: User) {
    // return this.http.post(
    //   BackendService.baseUrl + "user/" + BackendService.appKey,
    //   JSON.stringify({
    //     username: user.email,
    //     email: user.email,
    //     password: user.password
    //   }),
    //   { headers: this.getCommonHeaders() }
    // )
    // .pipe(catchError(this.handleErrors));

    return of(new Promise<Object>((resolve, reject) => {
      this.database.getdbConnection()
                      .then(db => {
                          db.execSQL("INSERT INTO users (user_id,password) VALUES (?,?)", [user.email, user.password]).then(id => {
                              resolve({ status: true });
                          }, err => {
                              reject({ status: false });
                          });
                      });
    }));
  }

  login(user: User) {
    // return this.http.post(
    //   BackendService.baseUrl + "user/" + BackendService.appKey + "/login",
    //   JSON.stringify({
    //     username: user.email,
    //     password: user.password
    //   }),
    //   { headers: this.getCommonHeaders() }
    // )
    // .pipe(
    //   tap((data: any) => {
    //     BackendService.token = data._kmd.authtoken;
    //   }),
    //   catchError(this.handleErrors)
    // );

    return of(new Promise<Object>((resolve, reject) => {
      this.database.getdbConnection()
                      .then(db => {
                          db.all("SELECT * FROM users where user_id like'" + user.email + "' and password like '" + user.password + "'").then(rows => {
                              if (rows.length > 0) {
                                  BackendService.token = "dummy_token";
                                  resolve({ status: true });
                              }
                              else {
                                  reject({ status: false });
                              }
                          });
                      });
    }));
  }

  logoff() {
    BackendService.token = "";
    this.database.closedbConnection();
  }

  resetPassword(email) {
    return this.http.post(
      BackendService.baseUrl + "rpc/" + BackendService.appKey + "/" + email + "/user-password-reset-initiate",
      {},
      { headers: this.getCommonHeaders() }
    ).pipe(catchError(this.handleErrors));
  }

  private getCommonHeaders() {
    return new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": BackendService.appUserHeader,
    });
  }

  private handleErrors(error: HttpErrorResponse) {
    console.log(JSON.stringify(error));
    return throwError(error);
  }
}
