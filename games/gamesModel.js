const db = require('../data/dbConfig');

module.exports = {
    insert,
    update,
    remove,
    getAll,
    findById,
    findByTitle,

}

async function insert(game) {
    const [id] = await db('games').insert(game);

    return findById(id);
}

function remove(id) {
    return db('games')
    .where({id})
    .del();
}

async function getAll() {
    return db('games');
}

async function findById(id) {
    return db('games')
    .where({id})
    .first();
}

function findByTitle(title) {
    return db('games')
    .where({title})
    .first();
  }

  async function update(id, changes) {
    return db('games')
      .where({id})
      .update(changes);
  }