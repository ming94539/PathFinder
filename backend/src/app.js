// random requirements
const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const app = express();

// table_data is to ensure that data is successfully queried from db
const data = require('./table_data');

// other requirements -- usage (dont ask me why)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const apiSpec = path.join(__dirname, '../api/openapi.yaml');
const apidoc = yaml.safeLoad(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec,
      validateRequests: true,
      validateResponses: true,
    }),
);

// Paths that we need to write
// Since we don't plan letting users add to DB, we only need GET 
app.get('/v0/data/', data.getAll);

// app use (dont ask me)
app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
