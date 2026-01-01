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

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        logger.info('MongoDB connecté');
        // Connexion réussie
    } catch (err) {
        // Utiliser un logger
        logger.error({ err }, 'Erreur de connexion à MongoDB');
        process.exit(1);
    }
};

export default connectDB;