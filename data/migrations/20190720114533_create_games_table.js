// npx knex migrate:latest  // for dev environment
// npx knex migrate:latest --env=testing    // for testing env


exports.up = async function(knex) {
    await knex.schema.createTable('games', tbl => {
        tbl.increments();
        tbl.string('title', 64).notNullable();
        tbl.string('genre', 64).notNullable();
        tbl.integer('releaseYear');
    })

    await knex.schema.createTable('test_db', tbl => {
      tbl.increments();
      tbl.string('title', 64).notNullable();
      tbl.string('genre', 64).notNullable();
      tbl.integer('releaseYear');
  })

  };

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('games');
};
