
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String
});

module.exports = mongoose.model('Contact', contactSchema);



