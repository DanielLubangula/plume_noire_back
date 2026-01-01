// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('MongoDB connecté');
//   } catch (error) {
//     console.error('Erreur de connexion MongoDB:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require('mongoose');
require('dotenv').config();


// Charger l'URI de MongoDB depuis .env
const mongoURI = process.env.MONGO_URI

// Fonction de connexion à MongoDB 
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connecté');
    } catch (err) {
        console.error('Erreur de connexion à MongoDB', err);
        process.exit(1);  // Quitter l'application en cas d'échec de la connexion
    }
}; 

module.exports =  connectDB ;  