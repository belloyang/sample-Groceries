import { Component } from "@angular/core";
import { DatabaseService } from "./shared/sqlite.service";

@Component({
  selector: "gr-main",
  template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent {
  constructor(private database: DatabaseService) {
    this.database.getdbConnection()
    .then(db => {
      db.execSQL("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, item_name TEXT, user_id TEXT)").then(() => {
        console.log("CREATE TABLE items");
      }, error => {
        console.log("CREATE TABLE ERROR", error);
      });
      db.execSQL("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT UNIQUE, password TEXT)").then(() => {
        console.log("CREATE TABLE users");
      }, error => {
        console.log("CREATE TABLE ERROR", error);
      });
    });
    }
 }
