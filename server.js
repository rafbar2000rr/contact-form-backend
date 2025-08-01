// ─── 1. IMPORTACIONES DE MÓDULOS───────────────────────────────
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); //Esto debe ir al inicio para usar las variables de entorno
const contactRoutes = require('./routes/contacts'); // Importa las rutas

// ─── 2. CONFIGURACIÓN DE LA APP ─────────────────────
const app = express(); // la función express() devuelve un objeto app que representa tu servidor web.

// ─── 3. MIDDLEWARES ─────────────────────────────────
app.use(cors()); //Permite que cualquier origen pueda acceder al backend.
app.use(express.json()); // le dice al servidor Express que acepte y procese automáticamente datos en 
                         //formato JSON que lleguen en el cuerpo (body) de las peticiones HTTP (como POST o PUT)
app.use('/api/contacts', contactRoutes);//le dice a Express:“Cada vez que llegue una solicitud que comience 
                                    // con /api/contacts, usa las rutas que están definidas en contactRoutes.”

// ─── 4. CONEXIÓN A BASE DE DATOS ────────────────────
mongoose.connect(process.env.MONGO_URI)// conecta la aplicación a tu base de datos MongoDB.
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

  // ─── 5. INICIAR SERVIDOR ────────────────────────────
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});


