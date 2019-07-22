
// MAKE sure you run yarn knex seed:run --env=testing


exports.seed = async function(knex) {
  // insert the seed values
    await knex('test_db').insert([
      {id: 1, title: 'Pacman_TEST_db', genre: 'Arcade', releaseYear: '1980'},
      {id: 2, title: 'Ms. Pacman_TEST_db', genre: 'Arcade', releaseYear: '1983'},
      {id: 3, title: 'Asteroids_TEST_db', genre: 'Aracade', releaseYear: '1980'},
      {id: 4, title: 'Space Invaders_TEST_db', genre: 'Arcade', releaseYear: '1980'},
    ]);
  };
