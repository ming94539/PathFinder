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
// app.get('/v0/data/', data.getData); // need to modify to enter arguments
app.get('/v0/data/:s/:t', data.getSkillsWithJob);
app.get('/v0/data/:s', data.getPopularFields);

// app use (dont ask me)
app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

// some stuff that may or may not be useful for deployment
// https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/
// Have Node serve files for the React app
// app.use(express.static(path.resolve(__dirname, '../frontend/build')));
app.use(express.static(path.resolve(__dirname, 'build')));

// Fallback for unhandled GET requests
app.get('*', (req, res) => {
  // res.sendFile(path.resolve(__dirname, '../../frontend/public', 'index.html'));
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

module.exports = app;
