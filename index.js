const express = require("express");
const helmet = require("helmet");

const db = require("./data/db.js");
const server = express();

server.use(express.json());
server.use(helmet());

const port = 3300;
server.listen(port, function() {
  console.log(`\ncohort api 👨‍💻🍞👩‍💻🤑👨‍🏫💸👩‍🎓 http://localhost:${port} ===\n`);
});

server.post("/api/cohorts", (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      errorMessage: "Please provide a name for the cohort"
    });
  }
  db.insert({
    name
  })
    .then(addedCohort => {
      res.status(201).json(addedCohort);
    })
    .catch(err =>
      res.status(500).json({
        error: "There was an error while adding this mf cohort to the mf zoo"
      })
    );
});

server.get("/api/cohorts", (req, res) => {
  db.find()
    .then(cohorts => {
      res.json(cohorts);
    })
    .catch(err => res.status(500).send(err));
});

server.get("/api/cohorts/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(cohort => {
      if (!cohort) {
        res.status(404).json({
          message: "The cohort with the specified ID doesn't exist"
        });
      }
      res.status(201).json(cohort);
    })
    .catch(err => {
      res.status(500).send({ error: "The cohort could not be retrieved." });
    });
});

server.get("/api/cohorts/:id/students", (req, res) => {
  const { id } = req.params;
  db.studentsFromCohort(id)
    .then(data => {
      if (!data) {
        res.status(404).json({
          message: "The cohort with the specified ID doesn't exist"
        });
      }
      res.status(201).json(data);
    })
    .catch(err =>
      res.status(500).send({ error: "The cohort could not be retrieved." })
    );
});

server.delete("/api/cohorts/:id", async (req, res) => {
  try {
    const cohortToDelete = await db.findById(req.params.id);
    const count = await db.remove(req.params.id);
    if (count > 0) {
      res.status(200).json(cohortToDelete);
    } else {
      res.status(404).json({
        message: "The cohort with the specified is not at the mf zoo"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "The cohort could not be retrieved." });
  }
});

server.put("/api/cohorts/:id", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      errorMessage: "Please provide a name for the cohort"
    });
  }
  try {
    const count = await db.update(req.params.id, req.body);
    if (count === 1) {
      res.status(200).json(req.body);
    }
  } catch {
    res.status(404).json({ error: "The cohort could not be retrieved." });
  }
});
