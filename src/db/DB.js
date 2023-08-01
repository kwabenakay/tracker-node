import { exit } from "process";
import sqlite3 from "sqlite3";

export class DB {
  createTableQery = `create table users (
        user_id integr AUTOINCREAMENT primary key,
        user_email text not null,
        user_password text not null,
        bookmark text 
    );`;
  newdb;

  constructor() {
    console.log("loadiing db");
    this.newdb=new sqlite3.Database(
      "./src/db/movies.db",
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (
          err &&
          err.message === "SQLITE_CANTOPEN: unable to open database file"
        ) {
          this.createDatabase();
          console.log("db greated");
          return;
        } else if (err) {
          console.log("Getting error " + err);
          console.log(err.stack);
          exit(1);
        }
      }
    );
  }

   createDatabase() {
    this.newdb = new sqlite3.Database("./src/db/movies.db", (err) => {
      if (err) {
        console.log("db creation error " + err);
        exit(1);
      }
      this.createTables(this.newdb);
    });
  }

   createTables(newdb) {
    newdb.exec(this.createTableQery, (err) => {
      if (err) {
        console.log("creating table error" + err.message);
      } else {
        console.log("table created");
      }
    });
  }

  verify(email, callback) {
    console.log("selecting");

    try {
      this.newdb.get(
        `select * from users where user_email = "${email}" `,
        (err, rows) => {
          if (err) {
            console.log("login" + err);
          }
           callback(rows);
        }
      );
    } catch (error) {
      console.log(error);
       callback("");
    }
    finally{
      this.newdb.close()
    }
  }

  create(user_email, user_password, resSender) {
    try {
      this.newdb.get(
        `select * from users where user_email = "${user_email}" `,
        (err, rows) => {
          if (err) {
            console.log("login" + err);
          }
          if (!rows) {
            this.accountCreator(user_email, user_password, resSender);
          } else {
            resSender("Already exist");
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
    finally{
      this.newdb.close()
    }
  }

   accountCreator(user_email, user_password, resSender) {
    let interupt = false;
    this.newdb.run(
      `insert into users (user_email, user_password) values("${user_email}","${user_password}") `,
      (err) => {
        if (err) {
          interupt = true;
          console.log("user creation error " + err);
        }
      }
    );
    console.log("insertion complete");
    resSender(interupt ? "failed" : "success");
  }
}