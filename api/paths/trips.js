const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');


// Helper function to get the trips from the database file
const getTrips = () => {
    const tripsPath = path.join(__dirname, '../db/trips.json'); // Adjust the path based on your project structure
    const tripsData = fs.readFileSync(tripsPath, 'utf-8');
    return JSON.parse(tripsData);
  };
  
  /**
   * @swagger
   * /api/trips:
   *   get:
   *     summary: Retrieve a list of all trips
   *     description: Fetches a list of trips from the database.
   *     responses:
   *       200:
   *         description: A list of trips.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                     example: "Summer Vacation"
   *                   country:
   *                     type: string
   *                     example: "Italy"
   *                   startDate:
   *                     type: string
   *                     format: date
   *                     example: "2024-06-01"
   *                   endDate:
   *                     type: string
   *                     format: date
   *                     example: "2024-06-10"
   *       500:
   *         description: Internal server error.
   */
  
  // GET endpoint for fetching all trips
  router.get('/', (req, res) => {
    try {
      const trips = getTrips();
      res.status(200).json(trips);
    } catch (error) {
      console.error('Error reading trips:', error);
      res.status(500).json({ error: 'Failed to fetch trips' });
    }
  });


/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Create a new trip
 *     description: This endpoint creates a new trip. The request body must contain the trip's name, country, start date, and end date.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - country
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the trip.
 *                 example: "Summer Vacation"
 *               country:
 *                 type: string
 *                 description: The country where the trip will take place.
 *                 example: "Italy"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the trip in YYYY-MM-DD format.
 *                 example: "2024-06-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the trip in YYYY-MM-DD format.
 *                 example: "2024-06-10"
 *     responses:
 *       200:
 *         description: The trip was successfully created.
 *       400:
 *         description: Missing required fields (name, country, start date, or end date).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Name and country are required fields"
 *       500:
 *         description: Internal server error.
 */
router.post('/', (req, res) => {
  if (!req.body.name || !req.body.country) {
    return res.status(400).json({ error: 'Name and country are required fields' });
  }

  if (!req.body.startDate || !req.body.endDate) {
    return res.status(400).json({ error: 'Start date and end date are required fields' });
  }

  // Additional logic to handle trip creation can go here

  return res.status(200).json({ message: 'Trip created successfully!' });
});

module.exports = router;
