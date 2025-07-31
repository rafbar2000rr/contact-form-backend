const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // 🔹 Esto debe ir al inicio para usar las variables de entorno

const contactRoutes = require('./routes/contacts'); // 🔹 Importa tus rutas

const app = express(); // la función express() devuelve un objeto app que representa tu servidor web.

app.use(cors()); //Permite que cualquier origen pueda acceder al backend.
app.use(express.json()); // le dice al servidor Express que acepte y procese automáticamente datos en 
                         //formato JSON que lleguen en el cuerpo (body) de las peticiones HTTP (como POST o PUT)
// 🔹 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)// conecta la aplicación a tu base de datos MongoDB.


  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// 🔹 Usa las rutas
app.use('/api/contacts', contactRoutes);//le dice a Express:“Cada vez que llegue una solicitud que comience 
                                    // con /api/contacts, usa las rutas que están definidas en contactRoutes.”

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
