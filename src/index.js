const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./../db/database");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("./../model/User");
const Job = require("./../model/Job");
const Process = require("./../model/Process");

dotenv.config();

const app = express();
const PORT_NUMBER = Number(process.env.PROCESS) || 3000;
const TOKEN_KEY = process.env.SECRET || "kay";

app.use(cors());
app.use(bodyParser.json());

sequelize.sync().then(() => {
  console.log("db is ready");
});
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
  let loginData = req.body;
  try {
    // Create token
    console.log(TOKEN_KEY);
    const token = jwt.sign(loginData, TOKEN_KEY, {
      expiresIn: "1h",
    });
    const SALTROUNDS = 10;
    bcrypt.genSalt(SALTROUNDS, function (err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        User.findOne({
          where: {
            email: req.body.email,
          },
        }).then((response) => {
          if (response) {
            bcrypt.compare(
              req.body.password,
              response.password,
              (err, isMatch) => {
                if (isMatch) {
                  res.send({ ...response, token });
                }
              }
            );
          }
        });
        if (err) {
          res.send("anfa");
        }
      });
    });
  } catch (error) {
    res.json({ error });
  }
});
app.post("/adduser", (req, res) => {
  const SALTROUNDS = 10;
  bcrypt.genSalt(SALTROUNDS, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      req.body.password = hash;
      User.create(req.body).then(() => {
        res.send("success");
      });
      if (err) {
        res.send("anfa");
      }
    });
  });
});
app.get("/user", (req, res) => {
  User.findAll({
    where: {
      id: req.body.id,
    },
  }).then((output) => {
    res.send(output);
  });
});

// app.post("/add", async (req, res) => {
//   try {
//     // response sender
//     const SALTROUNDS = 10;
//     let loginData = req.body;
//     bcrypt.genSalt(SALTROUNDS, function (err, salt) {
//       bcrypt.hash(loginData.password, salt, function (err, hash) {
//         User.create(req.body).then((response)=>{
//           res.send(`${response.name} has been added`)
//         })
//         console.log(hash);
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({ error });
//   }
// });

app.post("/addjob", (req, res) => {
  let input = { ...req.body };
  Job.create(input)
    .then((jobOutput) => {
      Process.create({ ...input, jobId: jobOutput.id })
        .then(() => {
          res.send("added");
        })
        .catch(() => {
          res.send("unable to create process");
        });
    })
    .catch(() => {
      res.send("unable to create job");
    });
});

app.post("/addprocess", (req, res) => {
  Process.create(req.body)
    .then(() => {
      res.send("added");
    })
    .catch(() => {
      res.send("unable to create process");
    });
});

app.get("/getprocess", (req, res) => {
  Process.findAll({
    where: {
      id: req.body.processId,
    },
  })
    .then((response) => {
      res.send(response);
    })
    .catch(() => {
      res.send("Error anfa");
    });
});

app.get("/getjob", (req, res) => {
  Job.findAll({
    where: {
      id: req.body.jobId,
    },
  })
    .then((response) => {
      res.send(response);
    })
    .catch(() => {
      res.send("Error anfa");
    });
});

app.listen(PORT_NUMBER, () => {
  console.log(`TRACKER SERVER
		http://localhost:${PORT_NUMBER}/`);
});
