const db = require('./db');

function formatData(data) {
  let result = {};
  for (let index in data) {
    result[index] = data
  }
  console.log('result:', result)

  return result;
}

// demand MUST match the alias used in its query template (ex: 's' for Skills s)
// job should match one of our 
exports.getData = async (req, res) => {

  let demand = req.params.s;
  let job = req.params.t.replace(/ /g, '');

  console.log('demand:', demand);
  console.log('job title:', job);

  switch(demand) {
    case('Most in Demand Skills'):
      demand='s'; break;
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

  let query = '';
  switch(demand) {
    case 's':
      query = skillDemand;
      break;
    // other cases here
    default:
      break;
  }

  console.log('USING QUERY:', query);
  const grab_all = await db.dbGet(query);

  if (grab_all) {
    //formatting
    formatData(grab_all)
    res.status(200).json(grab_all);
    return;
  } else {
    console.log('404');
    res.status(404).send();
    return;
  }
};