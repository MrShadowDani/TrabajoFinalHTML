document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------
    // VARIABLES GLOBALES
    // -----------------------------------------------------------

    // Formulario de Login
    const loginForm = document.getElementById('loginForm');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const togglePasswordBtn = document.getElementById('togglePassword');

    // Enlaces y Modales: Olvidaste Contraseña
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeForgotModal = document.getElementById('closeForgotModal');
    const recoverEmailInput = document.getElementById('recoverEmail');
    const cancelRecoverBtn = document.getElementById('cancelRecover');
    const sendRecoverBtn = document.getElementById('sendRecover');
    const recoverMessage = document.getElementById('recoverMessage');

    // Enlaces y Modales: Términos, Privacidad
    const termsLink = document.getElementById('termsLink');
    const termsModal = document.getElementById('termsModal');
    const closeTermsModal = document.getElementById('closeTermsModal');

    const privacyLink = document.getElementById('privacyLink');
    const privacyModal = document.getElementById('privacyModal');
    const closePrivacyModal = document.getElementById('closePrivacyModal');

    // Enlace y Modal: Crear cuenta
    const createAccountLink = document.getElementById('createAccountLink');
    const createAccountModal = document.getElementById('createAccountModal');
    const closeCreateModal = document.getElementById('closeCreateModal');
    const createAccountForm = document.getElementById('createAccountForm');
    const createMessage = document.getElementById('createMessage');

    // Campos del formulario "Crear cuenta"
    const newName = document.getElementById('newName');
    const newSurname = document.getElementById('newSurname');
    const birthdate = document.getElementById('birthdate');
    const gender = document.getElementById('gender');
    const phonePrefix = document.getElementById('phonePrefix');
    const phone = document.getElementById('phone');
    const newEmail = document.getElementById('newEmail');
    const newPassword = document.getElementById('newPassword');

    // Correos registrados (para "Olvidaste tu contraseña")
    const registeredEmails = [
        'usuario@icloud.com',
        'pepito@yahoo.es',
        'ana@hotmail.com',
        'otro@gmail.com',
        'jose@techvoltio.com',      // técnico
        'dani@voltioadmin.com'      // administrador
    ];

    // Dominios permitidos
    const userDomains = ['icloud.com', 'yahoo.es', 'hotmail.com', 'gmail.com'];
    const techDomain = 'techvoltio.com';
    const adminDomain = 'voltioadmin.com';

    // -----------------------------------------------------------
    // 1. Cargar datos de LocalStorage (Recordarme)
    // -----------------------------------------------------------
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');

    if (savedEmail && savedPassword) {
        emailField.value = savedEmail;
        passwordField.value = savedPassword;
        rememberCheckbox.checked = true;
    }

    // -----------------------------------------------------------
    // 2. Íconos SVG para el ojo (abierto y tachado)
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
    // 3. Toggle de Contraseña
    // -----------------------------------------------------------
    togglePasswordBtn.addEventListener('click', () => {
        if (passwordField.type === 'password') {
            // Mostrar contraseña
            passwordField.type = 'text';
            togglePasswordBtn.innerHTML = eyeSlashIcon;
        } else {
            // Ocultar contraseña
            passwordField.type = 'password';
            togglePasswordBtn.innerHTML = eyeIcon;
        }
    });

    // -----------------------------------------------------------
    // 4. Evento "submit" del Login (Roles y LocalStorage)
    // -----------------------------------------------------------
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const emailValue = emailField.value.trim();
        const passwordValue = passwordField.value.trim();

        if (!emailValue || !passwordValue) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Recordarme
        if (rememberCheckbox.checked) {
            localStorage.setItem('savedEmail', emailValue);
            localStorage.setItem('savedPassword', passwordValue);
        } else {
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword');
        }

        // Lógica de roles según dominio
        const domain = emailValue.split('@')[1]?.toLowerCase() || '';

        // Usuario
        if (userDomains.includes(domain)) {
            alert('Bienvenido, usuario');
            // Redirige a la página de usuarios
            window.location.href = '../../usuarios/dashboard.html';
            return;
        }
        // Técnico
        if (domain === techDomain) {
            alert('Bienvenido, técnico');
            window.location.href = '../../tecnicos/dashboard.html';
            return;
        }
        // Administrador
        if (domain === adminDomain) {
            alert('Bienvenido, administrador');
            window.location.href = '../../administradores/dashboard.html';
            return;
        }

        // Por defecto => usuario
        alert('Dominio no reconocido. Se asume usuario por defecto.');
        window.location.href = '../../usuarios/dashboard.html';
    });

    // -----------------------------------------------------------
    // 5. Olvidaste tu contraseña
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

    // Botón Buscar en el modal "Olvidaste tu contraseña"
    sendRecoverBtn.addEventListener('click', () => {
        const emailToRecover = recoverEmailInput.value.trim();
        if (!emailToRecover) {
            recoverMessage.textContent = 'Por favor, ingresa un correo electrónico válido.';
            return;
        }

        // Verificar si existe en registeredEmails
        if (registeredEmails.includes(emailToRecover.toLowerCase())) {
            recoverMessage.style.color = 'green';
            recoverMessage.textContent = 'El correo para cambiar la contraseña se ha enviado con éxito.';
        } else {
            recoverMessage.style.color = 'red';
            recoverMessage.textContent = 'Este correo no está registrado en nuestra plataforma.';
        }
    });

    // -----------------------------------------------------------
    // 6. Términos y Privacidad
    // -----------------------------------------------------------
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.style.display = 'block';
    });

    closeTermsModal.addEventListener('click', () => {
        termsModal.style.display = 'none';
    });

    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.style.display = 'block';
    });

    closePrivacyModal.addEventListener('click', () => {
        privacyModal.style.display = 'none';
    });

    // -----------------------------------------------------------
    // 7. Cerrar modales si se hace clic fuera de ellos
    // -----------------------------------------------------------
    window.addEventListener('click', (e) => {
        // Olvidaste contraseña
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
            recoverMessage.textContent = '';
            recoverEmailInput.value = '';
        }
        // Términos
        if (e.target === termsModal) {
            termsModal.style.display = 'none';
        }
        // Privacidad
        if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
        }
        // Crear cuenta
        if (e.target === createAccountModal) {
            createAccountModal.style.display = 'none';
            createMessage.textContent = '';
            createMessage.style.color = 'red';
            createAccountForm.reset();
        }
    });

    // -----------------------------------------------------------
    // 8. Crear Cuenta (nuevo modal)
    // -----------------------------------------------------------

    // Abrir modal
    createAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        createAccountModal.style.display = 'block';
    });

    // Cerrar modal
    closeCreateModal.addEventListener('click', () => {
        createAccountModal.style.display = 'none';
        createMessage.textContent = '';
        createMessage.style.color = 'red';
        createAccountForm.reset();
    });

    // Submit del formulario "Crear cuenta"
    createAccountForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Validar campos
        if (!newName.value.trim() || !newSurname.value.trim() ||
            !birthdate.value || !gender.value || !phone.value.trim() ||
            !newEmail.value.trim() || !newPassword.value.trim()) {
            createMessage.textContent = 'Por favor, completa todos los campos.';
            createMessage.style.color = 'red';
            return;
        }

        // Revisar dominio
        const emailValue = newEmail.value.trim().toLowerCase();
        const domain = emailValue.split('@')[1] || '';

        if (userDomains.includes(domain)) {
            // Usuario
            showSuccessCreateUser();
        } else if (domain === techDomain) {
            // Técnico
            showSuccessCreateUser();
        } else if (domain === adminDomain) {
            // Administrador
            showSuccessCreateUser();
        } else {
            createMessage.textContent = 'El dominio de correo no está permitido.';
            createMessage.style.color = 'red';
            return;
        }
    });

    // Función de éxito
    function showSuccessCreateUser() {
        createMessage.textContent = '¡Usuario creado con éxito!';
        createMessage.style.color = 'green';
        // Cierra el modal tras 2s
        setTimeout(() => {
            createAccountModal.style.display = 'none';
            createAccountForm.reset();
            createMessage.textContent = '';
            createMessage.style.color = 'red';
        }, 2000);
    }
});
