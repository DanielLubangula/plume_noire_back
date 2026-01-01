import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import connectDB from './config/db.js';
import adminAuthRoutes from './routes/admin/auth.admin.route.js';
import adminFirstSetupRoutes from './routes/admin/first-setup.admin.route.js';

dotenv.config();
await connectDB();

const app = express();
app.use(helmet());
app.use(cors());
app.use('/static', express.static(path.join(process.cwd(), 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin', adminFirstSetupRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenue sur notre site !');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.log(`Serveur démarré sur le port ${PORT}`);
});   
 