
const supertest = require('supertest');
const http = require('http');

const app = require('../frontend/src/demo');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
});




// const fs = require('fs');
// const {Pool} = require('pg');

// require('dotenv').config();
// process.env.POSTGRES_DB='test';

// const pool = new Pool({
//   host: 'localhost',
//   port: 5432,
//   database: process.env.POSTGRES_DB,
//   user: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
// });

// const run = async (file) => {
//   const content = fs.readFileSync(file, 'utf8');
//   const statements = content.split(/\r?\n/);
//   for (statement of statements) {
//     await pool.query(statement);
//   }
// };

test('GET Demand With Job', async () => {
  await request.put('/v0/data/:s/:t/')
    .expect(200)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
    })
});

afterAll((done) => {
  server.close(done);
});


// exports.reset = async () => {
//   await run('sql/schema.sql');
//   await run('sql/mail.sql');
//   await run('sql/indexes.sql');
// };



