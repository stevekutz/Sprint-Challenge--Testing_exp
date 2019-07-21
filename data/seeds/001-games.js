
exports.seed = async function(knex) {
// insert the seed values
  await knex('games').insert([
    {id: 1, title: 'Pacman', genre: 'Arcade', releaseYear: '1980'},
    {id: 2, title: 'Ms. Pacman', genre: 'Arcade', releaseYear: '1983'},
    {id: 3, title: 'Asteroids', genre: 'Aracade', releaseYear: '1980'},
    {id: 4, title: 'Space Invaders', genre: 'Arcade', releaseYear: '1980'},
  ]);
};
