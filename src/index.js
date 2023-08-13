const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const Sequelize = require("sequelize");

const sequelize = require("./../db/database");
const User = require("./../model/User");
const Job = require("./../model/Job");
const Process = require("./../model/Process");

dotenv.config();
const app = express();
const PORT_NUMBER = Number(process.env.PROCESS) || 3000;
const TOKEN_KEY = process.env.SECRET || "kay";

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

sequelize.sync().then(() => {
  console.log("db is ready");
});

//middle ware

function verifyToken(req, res, next) {
  const token = req.body.token;
  console.log("req.body")
  console.log(req.body)
  const user = jwt.verify(token, TOKEN_KEY);
  if (user) {
    next();
  } else {
    res.send("Login first");
  }
}

app.get("/", (req, res) => {
  res.send("working");
});

//post requests
app.post("/login", (req, res) => {
  let loginData = { email: req.body.email, password: req.body.password };
  try {
    console.log(req.body);
    const token = jwt.sign(loginData, TOKEN_KEY, {
      expiresIn: "14h",
    });

    User.findOne({
      where: {
        email: loginData.email,
      },
      include: [
        {
          model: Process,
          as: "processes",
          include: [
            {
              model: User,
              as: "user",
              where: { id: Sequelize.col("processes.creator") },
              attributes: ["email"],
            },
            {
              model: Job,
              as: "job",
              where: { id: Sequelize.col("processes.jobId") },
              attributes: ["jobName"],
            },
          ],
        },
      ],
    })
      .then((response) => {
        if (response) {
          console.log("working");
          bcrypt.compare(
            loginData.password,
            response.password,
            (_, isMatch) => {
              if (isMatch && response.isActivated) {
                let data = {
                  id: response.id,
                  name: response.username,
                  email: response.email,
                  process: response.processes,
                };
                console.log(response);

                res.cookie("token", token);
                res.send({ data ,token});
              } else {
                res.send("Unable to login");
              }
            }
          );
        } else {
          res.send("User not found");
        }
      })
      .catch((error) => {
        console.log(error);
        res.send("Wrong username or password");
      });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

app.post("/adduser", verifyToken, (req, res) => {
  try {
    const SALTROUNDS = 10;
    bcrypt.genSalt(SALTROUNDS, function (_, salt) {
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
  } catch (error) {
    res.json({ error });
  }
});

app.get("/getuser", verifyToken, (req, res) => {
  User.findAll({
    where: {
      id: req.body.id,
    },
  })
    .then((output) => {
      res.send(output);
    })
    .catch((error) => console.log(error));
});

app.post("/addjob", verifyToken, (req, res) => {
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

app.post("/addprocess", verifyToken, (req, res) => {
  Process.create(req.body)
    .then(() => {
      res.send("added");
    })
    .catch(() => {
      res.send("unable to create process");
    });
});

app.get("/getprocess", verifyToken, (req, res) => {
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

app.get("/sentprocess", verifyToken, (req, res) => {
  Process.findAll({
    where: {
      creator: req.body.userId,
    },
  })
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.log(error)
      res.send("Error anfa");
    });
});

app.get("/getjob", verifyToken, (req, res) => {
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
