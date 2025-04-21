require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); 
const upload = multer();

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,  
  database: process.env.DATABASE_NAME,
};

app.post('/api/usuarios', upload.single('foto'), async (req, res) => {
  try {
    // Verificar si el archivo se ha subido
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    // Verificar el archivo subido
    console.log('Archivo subido:', req.file); // Imprime los detalles del archivo subido

    const nombre = req.body.nombre?.trim() || '';
    const dni = req.body.dni?.trim() || '';
    const foto = req.file?.buffer;

    if (!nombre || !dni) {
      return res.status(400).json({ error: 'Nombre y DNI son requeridos' });
    }

    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'INSERT INTO usuarios (nombre, dni, foto) VALUES (?, ?, ?)',
      [nombre, dni, foto]
    );
    await connection.end();
    res.status(201).json({ message: 'Usuario creado' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));
