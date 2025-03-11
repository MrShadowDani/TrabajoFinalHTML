const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Para poder parsear JSON en el body

// Importa tus rutas
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
