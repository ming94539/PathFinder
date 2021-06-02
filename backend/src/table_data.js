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

  console.log('demand:', demand);
  console.log('job title:', job);

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

exports.getPopularFields = async (req, res) => {
// referenced and altered from: https://www.sisense.com/blog/exact-row-counts-for-every-database-table/
  let rowsOfEachTable = `
  select table_schema, table_name, (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
  from (                             
    select table_name, table_schema, 
      query_to_xml(format('select count(*) as cnt from %I.%I', table_schema, table_name), false, true, '') as xml_count
      from information_schema.tables
  where table_schema = 'public' 
  ) t order by row_count DESC`;

  let rowsOfJobTitles = `select table_schema, table_name as value, (xpath('/row/cnt/text()', xml_count))[1]::text::int as count
  from (                             
    select table_name, table_schema, 
      query_to_xml(format('select count(*) as cnt from %I.%I', table_schema, table_name), false, true, '') as xml_count
      from information_schema.tables
  where table_schema = 'public' and table_name != 'skills' and table_name != 'languages' and table_name != 'industries' 
  and table_name != 'jobidtable' and table_name != 'education' and table_name != 'degree' 
  ) t order by count DESC`;

  await callQuery(res, rowsOfJobTitles);
};
