/* 
  Database connection
*/
const {Pool} = require('pg');

const pool = new Pool({
  user: 'acraig1225',
    host: 'highlanderdb.cjnqiycyzhsl.us-east-2.rds.amazonaws.com',
    database: 'testing',
    password: '#$%cse115a#$%',
    port: 5432,
});

/* 
  connecting to db,  removed db disconnection
*/
pool.connect();

/*
  Queries
  - dbGetAll is the actual query, which gets called by table_data to ensure
  - that data is retrieved, and returns 200 or 404 or others.
  - table_data has function getAll, which is called in app.js for path
  - that path is used by front end
 */

// exports.dbGetAll = async () => {
//   const select = `SELECT * FROM industries`;
//   const query = {
//     text: select,
//     values: [],
//   };
//   const {rows} = await pool.query(query);
//   console.log(rows);
//   return rows;
// };

exports.dbGet = async (query) => {
  const q = {
    text: query,
    values: []
  };
  const {rows} = await pool.query(q);
  console.log('queried');
}