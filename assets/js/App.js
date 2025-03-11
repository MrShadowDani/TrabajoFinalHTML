// Espera a que todo el contenido del DOM se cargue
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el formulario de login usando su ID
    const form = document.getElementById('loginForm');

    // Agrega un evento para la acción de enviar el formulario
    form.addEventListener('submit', (event) => {
        // Prevenir el comportamiento por defecto (envío del formulario)
        event.preventDefault();

        // Obtener los valores de los campos de correo y contraseña
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validación: comprobar si el correo está vacío
        if (!email) {
            alert('Por favor, ingresa tu correo electrónico.');
            return;
        }

        // Validación: comprobar si la contraseña está vacía
        if (!password) {
            alert('Por favor, ingresa tu contraseña.');
            return;
        }

        // Validación básica del formato de correo electrónico usando una expresión regular
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        // Si todas las validaciones son correctas, se simula el inicio de sesión
        alert('¡Datos válidos! Procesando inicio de sesión...');
        // Aquí podrías realizar una petición AJAX o enviar el formulario de forma real
    });

    // Funcionalidad para mostrar/ocultar la contraseña
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');

    // Agrega el evento para el botón de mostrar/ocultar
    togglePasswordBtn.addEventListener('click', () => {
        // Cambia el tipo de input entre 'password' y 'text'
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            togglePasswordBtn.textContent = '🙈'; // Cambia el ícono para indicar que se muestra la contraseña
        } else {
            passwordField.type = 'password';
            togglePasswordBtn.textContent = '👁️'; // Icono original para ocultar la contraseña
        }
    });
});
