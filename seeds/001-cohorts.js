exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("cohorts")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("cohorts").insert([
        { id: 1, name: "webpt3" },
        { id: 2, name: "webpt4" },
        { id: 3, name: "webpt5" }
      ]);
    });
};
