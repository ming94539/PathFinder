const db = require('./db');

// demand MUST match the alias used in its query template (ex: 's' for Skills s)
// job should match one of our 
exports.getData = async (req, res) => {
  console.log('selection:', selection);
  const demand = req.params.demand;
  const job = req.params.job;
  // If user has chosen a job, create additional string for query
  // to match jobID with that job
  let jobTitleMatch = (job == 'Job Title') ? '' :
    `, ${job.replace(/ /g, '') } as j
    WHERE ${demand}.jobID = j.jobID`;

  // Most popular 
  let skillDemand = `
    SELECT s.skill, COUNT(*) AS count
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
  const grab_all = await db.dbGet(query);
  if (grab_all) {
    //formatting
    res.status(200).json(grab_all);
    
    return;
  } else {
    res.status(404).send();
    return;
  }
};