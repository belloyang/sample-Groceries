import { Injectable } from "@angular/core";
const Sqlite = require("nativescript-sqlite");
@Injectable()
export class DatabaseService {
    public getdbConnection() {
        return new Sqlite("groceries");
    }
    public closedbConnection() {
        new Sqlite("groceries")
        .then((db) => {
        db.close();
        });
    }
}