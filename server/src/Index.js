const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Para manejar CORS si es necesario

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Permite solicitudes desde diferentes orígenes

// Importa las rutas
const authRoutes = require('./routes/auth.routes');

// Usar las rutas
app.use('/api/auth', authRoutes);

// Inicia el servidor en el puerto 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
