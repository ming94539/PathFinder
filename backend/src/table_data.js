const db = require('./db');

// demand MUST match the alias used in its query template (ex: 's' for Skills s)
// job should match one of our 
exports.getData = async (req, res) => {
  // console.log(req.params.s); // demand
  // console.log(req.params.t); // job title
  // console.log(req.params.res);
  // console.log(req.query.job);

  const demand = req.params.s;
  // const job = req.params.job.replace(/ /g, '');
  // const demand='s';
  const job= req.params.t;

  // on submit: 
  //   if job is null:
  //     show all in demand skills
  //   if both are not null:
  //     query --> join demand.id on job.id

  console.log('demand:', demand);
  console.log('job title:', job);


  // If user has chosen a job, create additional string for query
  // to match jobID with that job
  let jobTitleMatch = (job == 'Job Title') ? '' :
    `, ${job} as j
    WHERE ${demand}.jobID = j.jobID`;

  // Most popular skill 
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
  console.log('grabbing');
  const grab_all = await db.dbGet(query);
  if (grab_all) {
    //formatting
    console.log('grabbed:', grab_all)
    res.status(200).json(grab_all);
    return;
  } else {
    console.log('404');
    res.status(404).send();
    return;
  }
};