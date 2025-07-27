const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // 🔹 Esto debe ir al inicio para usar las variables de entorno

const contactRoutes = require('./routes/contacts'); // 🔹 Importa tus rutas

const app = express();

app.use(cors());
app.use(express.json()); // 🔹 Necesario para que entienda JSON

// 🔹 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// 🔹 Usa las rutas
app.use('/api/contacts', contactRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
