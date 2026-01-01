const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require("path")

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'public'))); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

app.get('/', (req, res) => { 
  res.send('Bienvenue sur notre site !');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
