
exports.up = async function(knex) {
    await knex.schema.createTable('games', tbl => {
        tbl.increments();
        tbl.string('title', 64).notNullable();
        tbl.string('genre', 64).notNullable();
        tbl.integer('releaseYear');
    })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('games');
};
