const express = require('express');//Importa el módulo express, que es el framework para construir el servidor web en Node.js.
const router = express.Router();//Se usa para definir rutas separadas del archivo principal app.js. 
                                // Por ejemplo: rutas como /api/contacts.En lugar de declarar directamente en 
                                // app.get(...), aquí usarás router.get(...), y luego todo este router será conectado
                                //  en app.js
const Contact = require('../models/Contact');// Importa el modelo Contact que definiste antes con Mongoose.Con esto 
                                      // puedes hacer cosas como:Crear un contacto: Contact.create({ ... }),Buscar 
                                      // contactos: Contact.find()Eliminar o editar, etc.


const nodemailer = require('nodemailer');//Importa la librería nodemailer, que sirve para enviar correos electrónicos desde el backend.

//Usa express.Router() para definir rutas relacionadas a contactos.
//Usa el modelo Contact para guardar o leer contactos desde MongoDB.
//Usa nodemailer para enviar correos.

// Obtener todos los contactos
router.get('/', async (req, res) => {//Define una ruta que responde a solicitudes GET. Es asincrónica (async) porque va a hacer una operación que toma tiempo: consultar la base de datos.
  try {//Maneja errores para no romper la app si algo falla
    const contacts = await Contact.find();//Dentro del try, usamos await para esperar a que Mongoose consulte todos los contactos en la base de datos.Contact.find() busca todos los documentos (registros) en la colección contacts.
    res.json(contacts);//Envía los contactos al frontend como JSON
  } catch (err) {//Si ocurre un error (por ejemplo, si falla la conexión a la base de datos), se captura en el catch.
    res.status(500).json({ error: err.message });//Se responde con un error HTTP 500 (error interno del servidor), y se manda el mensaje del error en formato JSON.
  }
});


router.post('/', async (req, res) => {//Define una ruta para manejar solicitudes HTTP POST. La función es async porque vamos a guardar datos en MongoDB (toma tiempo)
  console.log("✅ POST /contact recibido");// Solo muestra en consola que se ha recibido la petición y qué datos llegaron.
  console.log("Datos recibidos:", req.body);//req.body contiene el JSON que envió el frontend o el formulario.

  try {
    const { name, address, email } = req.body;// Dentro del bloque try, extraemos name, address y email del cuerpo de la 
    // petición.Esto es destructuración de objeto: equivale a escribir const name = req.body.name, 
    // const address = req.body.address, etc.

    // Guardar en MongoDB
    const contact = new Contact({ name, address, email });//Creamos una nueva instancia del modelo Contact con los datos 
                                        //recibidos.Esto representa un nuevo documento que queremos guardar en MongoDB.
    await contact.save();//Guardamos el documento en MongoDB. await indica que esperamos a que termine el proceso antes
                        //de seguir.
    console.log("📦 Contacto guardado en MongoDB");

    // Configurar el transporte de Nodemailer
    const transporter = nodemailer.createTransport({//Crea un transportador, es decir, una "configuración" que Nodemailer usará para enviar los correos.
      service: 'gmail',
      auth: {//Proporciona las credenciales para autenticarte en la cuenta que enviará el correo.
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
    await transporter.sendMail(mailOptions);//Usa la configuración del transportador (transporter) y envía un correo con los datos que están en mailOptions. Espera a que se termine de enviar antes de seguir
    console.log("✉️ Email enviado correctamente");

    // Enviar respuesta al frontend
    res.status(200).json({ message: "Contacto guardado y email enviado" });//Es para enviar una respuesta al cliente 
                                                    // (por ejemplo, tu app React) diciendo que se guardó con éxito.

  } catch (error) {
    console.error("❌ Error en el POST /contact:", error);
    res.status(500).json({ message: "Error en el servidor" });//captura errores (como que Mongo esté desconectado) 
                                                          //y responde con un estado 500 (error del servidor).
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {//Contact.findByIdAndUpdate(...): 
                                                                                      // Busca un documento por su ID y lo actualiza.req.params.id: Es el ID que vino en la URL.req.body: Contiene los 
                                                                                       // nuevos datos que quieres guardar.{ new: true }: Indica que quieres recibir el documento actualizado, no el antiguo.
      new: true,
    });

    if (!updatedContact) {//Si updatedContact es null, significa que no se encontró ningún contacto con ese ID.
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    res.status(200).json({ message: 'Contacto actualizado con éxito', contact: updatedContact });//e devuelve el estado 200 OK, un mensaje y el contacto ya actualizado.
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el contacto' });//Si ocurre algún error inesperado (problemas de conexión, error de sintaxis, etc.), se devuelve un estado 500 Internal Server Error.
  }
});

// 🔹 Editar un contacto existente
// router.put('/:id', async (req, res) => {
//   try {
//     const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

router.delete('/:id', async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);//Esta línea define una ruta DELETE en /api/contactos/:id, donde :id representa el ID del contacto que queremos eliminar.
                                              //Contact.findByIdAndDelete(...) busca un contacto por su ID y lo elimina de la base de datos.
                                              //req.params.id es el ID que llega en la URL (por ejemplo, /api/contactos/64d3423ab...).
    if (!deletedContact) {
      return res.status(404).json({ error: 'Contacto no encontrado' });//Si no se encontró el contacto, devuelve un error 404 y un mensaje que dice que no se encontró.
    }

    res.status(200).json({ message: 'Contacto eliminado con éxito' });//Devuelve un estado 200 OK y un mensaje indicando que el contacto fue eliminado correctamente
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el contacto' });//Si ocurre un error en el servidor (por ejemplo, la base de datos está caída o el ID es inválido), devuelve 500 y un mensaje de error.
  }
});


// 🔹 Eliminar un contacto
// router.delete('/:id', async (req, res) => {
//   try {
//     await Contact.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Contacto eliminado' });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

module.exports = router;
