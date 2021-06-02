const db = require('./db');

/**
 * Executes query, then sets response data and/or HTTP status code
 * @param {Response}  res   Response from Express request
 * @param {String}        query SQL statement for querying data
 */
async function callQuery(res, query) {
  const result = await db.dbGet(query);

  if (result) {
    res.status(200).json(result);
    return;
  } else {
    res.status(404).send();
    return;
  }
}

/**
 * Creates query from demand and job parameters
 * @param {express.Request}   req Express request
 * @param {express.Response}  res Express response
 * @param {String} req.params.s   Demand query
 * @param {String} req.params.t   Job query
 */
exports.getDemandWithJob = async (req, res) => {
  let demand = req.params.s;
  let job = req.params.t.replace(/ /g, '');

  let value = '';
  switch(demand) {
    case('Skills'):
      value = 'skill'; break;
    case('Languages'):
      value = 'language'; break;
    case('Degrees'):
      value = 'degreetitle'; break;
    case 'Education':
      value = 'educationlevel'; break;
    case 'Industries':
      value = 'industry'; break;
    case('Most Popular Fields'):
      demand='f'; break;
    default:
      break;
  }

  let demandQuery = `
    SELECT ${demand}.${value} as value, COUNT(*) AS count
    FROM ${demand}, ${job}
    WHERE ${demand}.jobID = ${job}.jobID
    GROUP BY value
    ORDER BY count DESC
  `
  await callQuery(res, demandQuery);
};
