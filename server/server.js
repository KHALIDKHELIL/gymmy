const express = require('express');
const cors = require('cors');
const exercises = require('./seed/exercises.json'); 

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to fetch all exercises
app.get('/api/exercises', (req, res) => {
  res.json(exercises);
});

app.listen(5000, () => {
  console.log('Backend server is running on port 5000');
});