require('dotenv').config();

const server = require('./api/server');

const port = process.env.PORT || 5008;
server.listen(port, () => console.log(`\n SERVER running on port ${port} >> \n`));