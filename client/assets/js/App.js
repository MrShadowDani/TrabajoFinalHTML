/************************************************
 * App.js
 * Controla la lógica de Inicio de Sesión,
 * recuperación de contraseña, creación de cuenta
 * y la apertura/cierre de modales.
 * Se ejecuta cuando el DOM está listo.
 ************************************************/
document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------
    // 1. VARIABLES GLOBALES
    // -----------------------------------------------------------
    // Formulario de Login
    const loginForm           = document.getElementById('loginForm');
    const emailField          = document.getElementById('email');
    const passwordField       = document.getElementById('password');
    const rememberCheckbox    = document.getElementById('remember');
    const togglePasswordBtn   = document.getElementById('togglePassword');
    // Modales: Olvidaste Contraseña
    const forgotPasswordLink  = document.getElementById('forgotPasswordLink');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeForgotModal    = document.getElementById('closeForgotModal');
    const recoverEmailInput   = document.getElementById('recoverEmail');
    const cancelRecoverBtn    = document.getElementById('cancelRecover');
    const sendRecoverBtn      = document.getElementById('sendRecover');
    const recoverMessage      = document.getElementById('recoverMessage');
    // Modales: Términos y Privacidad
    const termsLink           = document.getElementById('termsLink');
    const termsModal          = document.getElementById('termsModal');
    const closeTermsModal     = document.getElementById('closeTermsModal');
    const privacyLink         = document.getElementById('privacyLink');
    const privacyModal        = document.getElementById('privacyModal');
    const closePrivacyModal   = document.getElementById('closePrivacyModal');
    // Modal: Crear Cuenta
    const createAccountLink   = document.getElementById('createAccountLink');
    const createAccountModal  = document.getElementById('createAccountModal');
    const closeCreateModal    = document.getElementById('closeCreateModal');
    const createAccountForm   = document.getElementById('createAccountForm');
    const createMessage       = document.getElementById('createMessage');
    // Campos del Formulario "Crear Cuenta"
    const newName             = document.getElementById('newName');
    const newSurname          = document.getElementById('newSurname');
    const birthdate           = document.getElementById('birthdate');
    const gender              = document.getElementById('gender');
    const phone               = document.getElementById('phone');
    const newEmail            = document.getElementById('newEmail');
    const newPassword         = document.getElementById('newPassword');
    // Dominios permitidos
    const userDomains         = ['icloud.com', 'yahoo.es', 'hotmail.com', 'gmail.com'];
    const techDomain          = 'techvoltio.com';
    const adminDomain         = 'adminvoltio.com';

    // -----------------------------------------------------------
    // 2. CARGAR DATOS "RECUÉRDAME" (LocalStorage)
    // -----------------------------------------------------------
    const savedEmail    = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedEmail && savedPassword) {
        emailField.value        = savedEmail;
        passwordField.value     = savedPassword;
        rememberCheckbox.checked = true;
    }

    // -----------------------------------------------------------
    // 3. ÍCONOS SVG PARA VISIBILIDAD DE CONTRASEÑA
    // -----------------------------------------------------------
    const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"
                            width="24" height="24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/></svg>`;
    const eyeSlashIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000" stroke-width="2"
                                 stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"
                                 width="24" height="24"><path d="M17.94 17.94A10.06 10.06 0 0112 20
                                 c-7 0-11-8-11-8a19.62 19.62 0 012.85-3.94M8.46 8.46A5 5 0 0116 12
                                 m0 0a5 5 0 00-5-5m9 9l-2.12-2.12M1 1l22 22"/></svg>`;

    // -----------------------------------------------------------
    // 4. SHOW/HIDE PASSWORD
    // -----------------------------------------------------------
    togglePasswordBtn.addEventListener('click', () => {
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            togglePasswordBtn.innerHTML = eyeSlashIcon;
        } else {
            passwordField.type = 'password';
            togglePasswordBtn.innerHTML = eyeIcon;
        }
    });

    // -----------------------------------------------------------
    // 5. SUBMIT LOGIN: VALIDACIONES + ROLES + REDIRECCIÓN
    // -----------------------------------------------------------
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const emailValue    = emailField.value.trim().toLowerCase();
        const passwordValue = passwordField.value.trim();
        if (!emailValue || !passwordValue) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        // Verificar credenciales en LocalStorage
        const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosVoltio')) || [];
        const usuario = usuariosRegistrados.find(u =>
            u.email === emailValue && u.password === passwordValue
        );
        if (!usuario) {
            alert('Correo o contraseña incorrectos.');
            return;
        }
        // Guardar o eliminar credenciales según "Recuérdame"
        if (rememberCheckbox.checked) {
            localStorage.setItem('savedEmail', emailValue);
            localStorage.setItem('savedPassword', passwordValue);
        } else {
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword');
        }
        // Determinar dominio y rol
        const domain = emailValue.split('@')[1];
        if (userDomains.includes(domain)) {
            alert('Bienvenido, usuario');
            window.location.href = 'usuarios/dashboard.html';
        } else if (domain === techDomain) {
            alert('Bienvenido, técnico');
            window.location.href = 'técnicos/dashboard.html';
        } else if (domain === adminDomain) {
            alert('Bienvenido, administrador');
            window.location.href = 'administradores/dashboard.html';
        } else {
            alert('Dominio no reconocido. Se asume usuario por defecto.');
            window.location.href = 'usuarios/dashboard.html';
        }
    });

    // -----------------------------------------------------------
    // 6. MODAL "OLVIDASTE TU CONTRASEÑA": ABRIR/CERRAR
    // -----------------------------------------------------------
    forgotPasswordLink.addEventListener('click', e => {
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

    // -----------------------------------------------------------
    // 7. RECUPERACIÓN DE CONTRASEÑA: VALIDACIÓN
    // -----------------------------------------------------------
    sendRecoverBtn.addEventListener('click', () => {
        const emailToRecover = recoverEmailInput.value.trim().toLowerCase();
        const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosVoltio')) || [];
        const existe = usuariosRegistrados.some(u => u.email === emailToRecover);
        if (!emailToRecover) {
            recoverMessage.textContent = 'Por favor, ingresa un correo electrónico válido.';
            recoverMessage.style.color = 'red';
            return;
        }
        if (existe) {
            recoverMessage.textContent = 'El correo para cambiar la contraseña se ha enviado con éxito.';
            recoverMessage.style.color = 'green';
        } else {
            recoverMessage.textContent = 'Este correo no está registrado en nuestra plataforma.';
            recoverMessage.style.color = 'red';
        }
    });

    // -----------------------------------------------------------
    // 8. MODALES TÉRMINOS Y PRIVACIDAD: ABRIR/CERRAR
    // -----------------------------------------------------------
    termsLink.addEventListener('click', e => {
        e.preventDefault();
        termsModal.style.display = 'block';
    });
    closeTermsModal.addEventListener('click', () => {
        termsModal.style.display = 'none';
    });
    privacyLink.addEventListener('click', e => {
        e.preventDefault();
        privacyModal.style.display = 'block';
    });
    closePrivacyModal.addEventListener('click', () => {
        privacyModal.style.display = 'none';
    });

    // -----------------------------------------------------------
    // 9. CERRAR MODALES AL HACER CLIC FUERA DE ELLOS
    // -----------------------------------------------------------
    window.addEventListener('click', e => {
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
            recoverMessage.textContent = '';
            recoverEmailInput.value = '';
        }
        if (e.target === termsModal) {
            termsModal.style.display = 'none';
        }
        if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
        }
        if (e.target === createAccountModal) {
            createAccountModal.style.display = 'none';
            createMessage.textContent = '';
            createMessage.style.color = 'red';
            createAccountForm.reset();
        }
    });

    // -----------------------------------------------------------
    // 10. MODAL "CREAR CUENTA": ABRIR/CERRAR
    // -----------------------------------------------------------
    createAccountLink.addEventListener('click', e => {
        e.preventDefault();
        createAccountModal.style.display = 'block';
    });
    closeCreateModal.addEventListener('click', () => {
        createAccountModal.style.display = 'none';
        createMessage.textContent = '';
        createMessage.style.color = 'red';
        createAccountForm.reset();
    });

    // -----------------------------------------------------------
    // 11. SUBMIT CREAR CUENTA: VALIDACIONES + ALTA
    // -----------------------------------------------------------
    createAccountForm.addEventListener('submit', event => {
        event.preventDefault();
        if (
            !newName.value.trim() ||
            !newSurname.value.trim() ||
            !birthdate.value ||
            !gender.value ||
            !phone.value.trim() ||
            !newEmail.value.trim() ||
            !newPassword.value.trim()
        ) {
            createMessage.textContent = 'Por favor, completa todos los campos.';
            createMessage.style.color = 'red';
            return;
        }
        const emailValue    = newEmail.value.trim().toLowerCase();
        const passwordValue = newPassword.value.trim();
        const domain        = emailValue.split('@')[1];
        // Comprueba dominio permitido
        if (![...userDomains, techDomain, adminDomain].includes(domain)) {
            createMessage.textContent = 'El dominio de correo no está permitido.';
            createMessage.style.color = 'red';
            return;
        }
        // Añade usuario a LocalStorage
        const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosVoltio')) || [];
        const yaExiste = usuariosRegistrados.some(u => u.email === emailValue);
        if (yaExiste) {
            createMessage.textContent = 'Este correo ya está registrado.';
            createMessage.style.color = 'red';
            return;
        }
        usuariosRegistrados.push({ email: emailValue, password: passwordValue });
        localStorage.setItem('usuariosVoltio', JSON.stringify(usuariosRegistrados));
        // Mensaje de éxito y cierre
        createMessage.textContent = '¡Usuario creado con éxito!';
        createMessage.style.color = 'green';
        setTimeout(() => {
            createAccountModal.style.display = 'none';
            createAccountForm.reset();
            createMessage.textContent = '';
            createMessage.style.color = 'red';
        }, 2000);
    });
});
