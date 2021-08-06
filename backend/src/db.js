/**
 * Database connection
 */
const {Pool} = require('pg');

const pool = new Pool({
  user: 'user',
    host: 'rds.amazonaws.com',
    database: 'testing',
    password: 'password',
    port: 5432,
});

pool.connect();

/**
 * Exeucutes the passed in query
 * @param   {String}  query SQL statement to be executed
 * @return  {Array}   Query result in JSON format
 */
exports.dbGet = async (query) => {
  const q = {
    text: query,
    values: []
  };
  const {rows} = await pool.query(q);
  return rows;
}
