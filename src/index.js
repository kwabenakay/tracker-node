import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT_NUMBER = Number(process.env.PROCESS) || 3000;
const TOKEN_KEY = process.env.SECRET;

app.use(cors());
app.use(bodyParser.json());

//add bookmarks

//middle ware
// function verifyToken(req, res, next) {
//   let loginData = req.body;
//   const token = req.cookies.token;
//   const user = jwt.verify(token, TOKEN_KEY);
//   function sort(row) {
//     if (row) {
//       next();
//     } else {
//       res.redirect("/login");
//     }
//   }
// }

//get requests
app.get("/", (req, res) => {
  res.send("working");
});

//post requests
app.post("/login", async (req, res) => {
  //   let loginData = req.body;
  //   console.log(loginData);
  //   try {
  //     let movies = JSON.parse(fs.readFileSync(__dirname + "/data.json", "utf8"));
  //     // Create token
  //     console.log(TOKEN_KEY);
  //     const token = jwt.sign(loginData, TOKEN_KEY, {
  //       expiresIn: "1h",
  //     });
  //     const DATA_BASE = new DB();
  //     DATA_BASE.verify(loginData.email, sort);
  //     //callback function
  //     function sort(row) {
  //       if (row) {
  //         // verifying password
  //         bcrypt.compare(
  //           loginData.password,
  //           row.user_password,
  //           function (err, result) {
  //             let finalMovie;
  //             if (result) {
  //               finalMovie = addBookmark(row, movies);
  //               console.log("token\n" + token);
  //             }
  //             finalMovie = finalMovie ? finalMovie : [];
  //             res.json({ result, finalMovie, token });
  //           }
  //         );
  //       } else {
  //         res.json("login failed");
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.json({ error });
  //   }
});

app.post("/signup", async (req, res) => {
  try {
    // response sender
    function resSender(result) {
      console.log(result);
      res.json(result);
    }
    const SALTROUNDS = 10;
    let loginData = req.body;
    // hashing password
    bcrypt.genSalt(SALTROUNDS, function (err, salt) {
      bcrypt.hash(loginData.password, salt, function (err, hash) {
        const DATA_BASE = new DB();
        DATA_BASE.create(loginData.email, hash, resSender);
        console.log(hash);
      });
    });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`TRACKER SERVER
		http://localhost:${PORT_NUMBER}/`);
});
