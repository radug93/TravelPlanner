const express = require('express');
const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const middlewares = jsonServer.defaults();
const getDb = () => {
    const trips = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'trips.json')));
  
    return {
      ...trips,
    };
  };

const router = jsonServer.router(getDb());
const dbFilePath = path.join(__dirname, 'db.json');

app.use(bodyParser.json());
const saveDb = (db) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
  };
app.post('/api/trips', (req, res, next) => {
    console.log(req.body)
    if (!req.body.name || !req.body.country) {
      return res.status(400).json({ error: 'Name and country are required fields' });
    }

    if (!req.body.startDate || !req.body.endDate) {
        return res.status(400).json({ error: 'Start date and end date are required fields' });
      }
    // Additional validation logic can be added here
    next();
  });


  router.render = (req, res) => {
    const db = router.db.getState();
    saveDb(db);
    res.jsonp(res.locals.data);
  };
  
app.use(middlewares);
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});