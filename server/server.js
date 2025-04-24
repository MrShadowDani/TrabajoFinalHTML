// server/server.js
const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// 1) Monta todo tu /client como estático en la raíz de URL:
app.use('/', express.static(path.join(__dirname, '../client')));

// 2) Para SPAs, redirige cualquier otra ruta a tu Index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/Index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});