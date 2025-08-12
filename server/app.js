const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas básicas
app.get('/', (req, res) => {
  res.send('Hola Mundo desde Express!');
});
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chats', chatRoutes);
// Exportar la aplicación configurada
module.exports = app;