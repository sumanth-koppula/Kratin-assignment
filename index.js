const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection URL
const dbUrl = 'mongodb://0.0.0.0:27017/elderly_care'; // Connect to 'elderly_care' database

// Mongoose setup
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Create a Medication schema
const medicationSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  schedule: String,
});

// Create a Medication model based on the schema
const Medication = mongoose.model('Medication', medicationSchema);

// GET Route - Display all medications
app.get('/', async (req, res) => {
  try {
    const medications = await Medication.find({});
    res.render('index', { medications });
  } catch (err) {
    res.status(500).send('Error accessing the database.');
  }
});

// POST Route - Add a new medication
app.post('/add', async (req, res) => {
  const { name, dosage, schedule } = req.body;
  try {
    await Medication.create({ name, dosage, schedule });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error adding medication to the database.');
  }
});

// POST Route - Delete a medication
app.post('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await Medication.findByIdAndRemove(id);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error deleting medication from the database.');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
