const db = require('./db');

exports.getAll = async (req, res) => {

        const grab_all = await db.dbGetAll();
        if (grab_all) {
          res.status(200).json(grab_all);
          return;
        } else {
          res.status(404).send();
          return;
        }
};