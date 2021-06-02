/**
 * Database connection
 */
const {Pool} = require('pg');

const pool = new Pool({
  user: 'acraig1225',
    host: 'highlanderdb.cjnqiycyzhsl.us-east-2.rds.amazonaws.com',
    database: 'testing',
    password: '#$%cse115a#$%',
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