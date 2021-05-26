const db = require('./db');

async function callQuery(res, query) {
  const result = await db.dbGet(query);

  if (result) {
    console.log("200 status", result);
    res.status(200).json(result);
    return;
  } else {
    console.log('404');
    res.status(404).send();
    return;
  }
}

exports.getSkillsWithJob = async (req, res) => {

  let demand = req.params.s;
  let job = req.params.t.replace(/ /g, '');

  console.log('demand:', demand);
  console.log('job title:', job);

  switch(demand) {
    case('Most in Demand Skills'):
      demand='s'; break;
    case('Most in Demand Languages'):
      demand='l'; break;
    case('Most Popular Fields'):
      demand='f'; break;
    default:
      break;
  }

  // If user has chosen a job, create additional string for query
  // to match jobID with that job
  let jobTitleMatch = (job == 'JobTitle') ? '' :
    `, ${job} as j
    WHERE ${demand}.jobID = j.jobID`;

  // Most popular skill 
  let skillDemand = `
    SELECT s.skill as value, COUNT(*) AS count
    FROM Skills s ${jobTitleMatch}
    GROUP BY s.skill
    ORDER BY count DESC
  `;

    // Most popular language 
    let languageDemand = `
    SELECT l.language as value, COUNT(*) AS count
    FROM Languages l ${jobTitleMatch}
    GROUP BY l.language
    ORDER BY count DESC
  `;
  
  let query = '';
  switch(demand) {
    case 's':
      query = skillDemand;
      break;
    case 'l':
      query = languageDemand;
      break;
    case 'f':
      query = rowsOfJobTitles;
      break;
    default:
      break;
  }

  console.log('USING QUERY:', query);
  await callQuery(res, query);
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
