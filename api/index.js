const express = require('express');
const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const middlewares = jsonServer.defaults();

const app = express();
const router = jsonServer.router(getDb());
const dbFilePath = path.join(__dirname, 'db.json');

// Load the trip routes
const tripRoutes = require('./paths/trips');

// Middleware setup
app.use(bodyParser.json());
app.use(middlewares);

// Define the trip routes
app.use('/api/trips', tripRoutes);

// Swagger options
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: 'Trip API',
      version: '1.0.0',
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./paths/*.js"],  // Swagger will scan the routes folder for API documentation
};

// Initialize Swagger docs
const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// Function to fetch database
function getDb() {
  const trips = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'trips.json')));
  return { ...trips };
}

// Save database after each change
function saveDb(db) {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
}

// Custom router render function
router.render = (req, res) => {
  const db = router.db.getState();
  saveDb(db);
  res.jsonp(res.locals.data);
};

// Use JSON Server router
app.use('/api', router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});
