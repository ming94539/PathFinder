const db = require('./db');

// demand MUST match the alias used in its query template (ex: 's' for Skills s)
// job should match one of our 
exports.getData = async (req, res) => {
  console.log("testing here");
  // console.log(req);
  console.log(req.params.s);
  // console.log(req.query.job);

  // const demand = req.params.demand;
  // // const job = req.params.job.replace(/ /g, '');
  // // const demand='s';
  // const job='Job Title';
  // console.log('demand:', demand);
  // // console.log(req);

  // // If user has chosen a job, create additional string for query
  // // to match jobID with that job
  // let jobTitleMatch = (job == 'Job Title') ? '' :
  //   `, ${job} as j
  //   WHERE ${demand}.jobID = j.jobID`;

  // // Most popular skill 
  // let skillDemand = `
  //   SELECT s.skill, COUNT(*) AS count
  //   FROM Skills s ${jobTitleMatch}
  //   GROUP BY s.skill
  //   ORDER BY count DESC
  // `;

  // let query = '';
  // switch(demand) {
  //   case 's':
  //     query = skillDemand;
  //     break;
  //   // other cases here
  //   default:
  //     break;
  // }
  // console.log('grabbing');
  // const grab_all = await db.dbGet(query);
  // if (grab_all) {
  //   //formatting
  //   console.log('grabbed:', grab_all)
  //   res.status(200).json(grab_all);
  //   return;
  // } else {
  //   console.log('404');
  //   res.status(404).send();
  //   return;
  // }
};