// auth.controller.js
const bcrypt = require('bcrypt');

const usersDB = [
    {
        email: 'admin@miempresaAdmin.com',
        // contraseña hasheada de "admin123" (ejemplo)
        password: '$2b$10$g0MGHTbkHZ3eD...etc...',
        role: 'admin'
    },
    {
        email: 'tecnico@techmiempresa.com',
        password: '$2b$10$zA1P2...etc...',
        role: 'tech'
    },
    {
        email: 'usuario@icloud.com',
        password: '$2b$10$QRMfB...etc...',
        role: 'user'
    }
];

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar el usuario en la "base de datos"
        const user = usersDB.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        // 2. Comparar contraseñas con bcrypt
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // 3. Retornar respuesta exitosa, con rol, etc.
        return res.status(200).json({
            message: 'Login exitoso',
            role: user.role
            // aquí podrías generar un token JWT si lo deseas
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

exports.register = async (req, res) => {
    // Ejemplo de registro
    // ...
};
