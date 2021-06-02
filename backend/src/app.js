const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const app = express();

const data = require('./table_data');

// Express app configuration
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
app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

// API endpoint for sending request to database
app.get('/v0/data/:s/:t', data.getDemandWithJob);

module.exports = app;
