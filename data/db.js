const knex = require("knex");
const knexConfig = require("../knexfile.js");
const db = knex(knexConfig.development);

module.exports = {
  find,
  findById,
  insert,
  update,
  remove,
  matchStudentsToCohort
};

function find() {
  return db("cohorts");
}

function findById(id) {
  return db("cohorts").where({ id: Number(id) });
}

function insert(cohort) {
  return db("cohorts")
    .insert(cohort)
    .then(ids => ({ id: ids[0] }));
}

function update(id, cohort) {
  return db("cohorts")
    .where("id", Number(id))
    .update(cohort);
}

function remove(id) {
  return db("cohorts")
    .where("id", Number(id))
    .del();
}

function matchStudentsToCohort(id) {
  return db("students")
    .innerJoin("cohorts", "students.id", "cohorts.id")
    .where("cohorts.id", Number(id));
}
