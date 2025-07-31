
const mongoose = require('mongoose');//Importa la librería mongoose, que permite interactuar con MongoDB usando objetos JavaScript.

const contactSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String
});

module.exports = mongoose.model('Contact', contactSchema);//Crea el modelo con el nombre 'Contact' (esto genera una 
// colección en MongoDB llamada automáticamente contacts, en minúscula y plural).Te da acceso a funciones como: 
// Contact.find(), Contact.create(), Contact.deleteOne(), etc.



