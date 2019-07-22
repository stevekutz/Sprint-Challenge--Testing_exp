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
    const [id] = await db('test_db').insert(game);

    return findById(id);
}

async function update(id, changes) {
    return db('foods')
      .where({id})
      .update(changes);
  }

function remove(id) {
    return db('test_db')
    .where({id})
    .del();
}

async function getAll() {
    return db('test_db');
}

async function findById(id) {
    return db('test_db')
    .where({id})
    .first();
}

function findByTitle(title) {
    return db('test_db')
    .where({title})
    .first();
  }