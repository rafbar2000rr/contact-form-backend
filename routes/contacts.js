const express = require('express');
const router = express.Router();
const Contact = require('../models/contacts');
const nodemailer = require('nodemailer');

// 🔹 Obtener todos los contactos
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  console.log("✅ POST /contact recibido");
  console.log("Datos recibidos:", req.body);

  try {
    const { name, address, email } = req.body;

    // Guardar en MongoDB
    const contact = new Contact({ name, address, email });
    await contact.save();
    console.log("📦 Contacto guardado en MongoDB");

    // Configurar el transporte de Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Configurar el contenido del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: 'Nuevo contacto',
      text: `Nombre: ${name}\nDirección: ${address}\nEmail: ${email}`
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log("✉️ Email enviado correctamente");

    // Enviar respuesta al frontend
    res.status(200).json({ message: "Contacto guardado y email enviado" });

  } catch (error) {
    console.error("❌ Error en el POST /contact:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});


// 🔹 Editar un contacto existente
router.put('/:id', async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// 🔹 Eliminar un contacto
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contacto eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
