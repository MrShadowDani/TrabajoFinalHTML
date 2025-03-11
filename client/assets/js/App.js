document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------
    // 1. Variables y Selecciones
    // -----------------------------------------------------------
    const loginForm = document.getElementById('loginForm');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const togglePasswordBtn = document.getElementById('togglePassword');

    // Modales (Olvidaste Contraseña, Términos, Privacidad)
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeForgotModal = document.getElementById('closeForgotModal');
    const recoverEmailInput = document.getElementById('recoverEmail');
    const cancelRecoverBtn = document.getElementById('cancelRecover');
    const sendRecoverBtn = document.getElementById('sendRecover');
    const recoverMessage = document.getElementById('recoverMessage');

    const termsLink = document.getElementById('termsLink');
    const termsModal = document.getElementById('termsModal');
    const closeTermsModal = document.getElementById('closeTermsModal');

    const privacyLink = document.getElementById('privacyLink');
    const privacyModal = document.getElementById('privacyModal');
    const closePrivacyModal = document.getElementById('closePrivacyModal');

    // Array simulado de correos registrados (para recuperación)
    const registeredEmails = [
        'usuario@icloud.com',
        'pepito@yahoo.es',
        'ana@hotmail.com',
        'otro@gmail.com',
        'tecnico@techmiempresa.com',   // técnico
        'admin@miempresaAdmin.com'     // administrador
    ];

    // -----------------------------------------------------------
    // 2. Cargar datos de LocalStorage (si el usuario marcó "Recordarme")
    // -----------------------------------------------------------
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');

    if (savedEmail && savedPassword) {
        emailField.value = savedEmail;
        passwordField.value = savedPassword;
        rememberCheckbox.checked = true;
    }

    // -----------------------------------------------------------
    // 3. Íconos SVG para el ojo (abierto y tachado)
    // -----------------------------------------------------------
    const eyeIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"
           width="24" height="24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    `;

    const eyeSlashIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"
           width="24" height="24">
        <path d="M17.94 17.94A10.06 10.06 0 0112 20c-7 0-11-8-11-8a19.62 19.62 0 012.85-3.94M8.46 8.46A5 5 0 0116 12m0 0a5 5 0 00-5-5m9 9l-2.12-2.12M1 1l22 22"/>
      </svg>
    `;

    // -----------------------------------------------------------
    // 4. Mostrar/Ocultar Contraseña (toggle)
    // -----------------------------------------------------------
    togglePasswordBtn.addEventListener('click', () => {
        if (passwordField.type === 'password') {
            // Mostrar la contraseña
            passwordField.type = 'text';
            // Cambiar ícono al ojo tachado
            togglePasswordBtn.innerHTML = eyeSlashIcon;
        } else {
            // Ocultar la contraseña
            passwordField.type = 'password';
            // Cambiar ícono al ojo abierto
            togglePasswordBtn.innerHTML = eyeIcon;
        }
    });

    // -----------------------------------------------------------
    // 5. Evento "submit" del Formulario de Inicio de Sesión
    // -----------------------------------------------------------
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const emailValue = emailField.value.trim();
        const passwordValue = passwordField.value.trim();

        // Validación básica
        if (!emailValue || !passwordValue) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Guardar o eliminar credenciales en LocalStorage según "Recordarme"
        if (rememberCheckbox.checked) {
            localStorage.setItem('savedEmail', emailValue);
            localStorage.setItem('savedPassword', passwordValue);
        } else {
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword');
        }

        // -----------------------------------------------------------
        // Lógica de roles según el dominio del correo
        // -----------------------------------------------------------
        const domain = emailValue.split('@')[1]?.toLowerCase() || '';

        // Usuarios => @icloud.com, @yahoo.es, @hotmail.com, @gmail.com
        if (
            domain === 'icloud.com' ||
            domain === 'yahoo.es' ||
            domain === 'hotmail.com' ||
            domain === 'gmail.com'
        ) {
            alert('Bienvenido, usuario');
            window.location.href = '../../usuarios/dashboard.html';
            return;
        }

        // Técnico => dominio que empiece con "tech" y termine con ".com"
        if (domain.startsWith('tech') && domain.endsWith('.com')) {
            alert('Bienvenido, técnico');
            window.location.href = '../../tecnicos/dashboard.html';
            return;
        }

        // Administrador => dominio que incluya "admin.com"
        if (domain.includes('admin.com')) {
            alert('Bienvenido, administrador');
            window.location.href = '../../administradores/dashboard.html';
            return;
        }

        // Si no coincide con ninguna regla, se asume "usuario" por defecto
        alert('Dominio no reconocido. Se asume usuario por defecto.');
        window.location.href = '../../usuarios/dashboard.html';
    });

    // -----------------------------------------------------------
    // 6. Olvidaste tu Contraseña (Abrir/Cerrar Modal)
    // -----------------------------------------------------------
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordModal.style.display = 'block';
    });

    closeForgotModal.addEventListener('click', () => {
        forgotPasswordModal.style.display = 'none';
        recoverMessage.textContent = '';
        recoverEmailInput.value = '';
    });

    cancelRecoverBtn.addEventListener('click', () => {
        forgotPasswordModal.style.display = 'none';
        recoverMessage.textContent = '';
        recoverEmailInput.value = '';
    });

    // Botón "Buscar" en la recuperación de contraseña
    sendRecoverBtn.addEventListener('click', () => {
        const emailToRecover = recoverEmailInput.value.trim();
        if (!emailToRecover) {
            recoverMessage.textContent = 'Por favor, ingresa un correo electrónico válido.';
            return;
        }

        // Verificamos si el correo está en el array de registrados
        if (registeredEmails.includes(emailToRecover.toLowerCase())) {
            recoverMessage.style.color = 'green';
            recoverMessage.textContent = 'Se ha enviado un correo para restablecer tu contraseña.';
        } else {
            recoverMessage.style.color = 'red';
            recoverMessage.textContent = 'Este correo no está registrado en nuestra plataforma.';
        }
    });

    // -----------------------------------------------------------
    // 7. Modal Términos de Servicio (Abrir/Cerrar)
    // -----------------------------------------------------------
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.style.display = 'block';
    });

    closeTermsModal.addEventListener('click', () => {
        termsModal.style.display = 'none';
    });

    // -----------------------------------------------------------
    // 8. Modal Política de Privacidad (Abrir/Cerrar)
    // -----------------------------------------------------------
    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.style.display = 'block';
    });

    closePrivacyModal.addEventListener('click', () => {
        privacyModal.style.display = 'none';
    });

    // -----------------------------------------------------------
    // 9. Cerrar Modales al hacer clic fuera de ellos (opcional)
    // -----------------------------------------------------------
    window.addEventListener('click', (e) => {
        // Si hace clic fuera del contenido del modal "Olvidaste tu contraseña"
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
            recoverMessage.textContent = '';
            recoverEmailInput.value = '';
        }
        // Si hace clic fuera de Términos de Servicio
        if (e.target === termsModal) {
            termsModal.style.display = 'none';
        }
        // Si hace clic fuera de Política de Privacidad
        if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
        }
    });
});
