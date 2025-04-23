const users = []; // En un caso real, usarías una base de datos

// Controlador para el login
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Simulamos la búsqueda de un usuario
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.status(200).json({ message: 'Login exitoso', user });
    } else {
        res.status(400).json({ message: 'Credenciales incorrectas' });
    }
};

// Controlador para el registro
exports.register = (req, res) => {
    const { email, password } = req.body;

    // Verifica si el usuario ya existe
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Usuario ya existe' });
    }

    // Registra al nuevo usuario
    const newUser = { email, password };
    users.push(newUser);

    res.status(201).json({ message: 'Usuario registrado', user: newUser });
};
