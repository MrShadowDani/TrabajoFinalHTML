document.addEventListener('DOMContentLoaded', () => {
    const sessionBtn = document.getElementById('sessionBtn');
    const sessionModal = document.getElementById('sessionModal');
    const closeModal = document.getElementById('closeModal');
    const toggleTheme = document.getElementById('toggleTheme');

    // 1) Abrir el modal al hacer clic en "Inicio de sesión"
    sessionBtn.addEventListener('click', () => {
        sessionModal.style.display = 'block';
    });

    // 2) Cerrar el modal al pulsar la X
    closeModal.addEventListener('click', () => {
        sessionModal.style.display = 'none';
    });

    // 3) Cerrar modal si se hace clic fuera de la caja
    window.addEventListener('click', (e) => {
        if (e.target === sessionModal) {
            sessionModal.style.display = 'none';
        }
    });

    // 4) Cambiar aspecto (claro/oscuro)
    let isDark = false;
    toggleTheme.addEventListener('click', (e) => {
        e.preventDefault();
        isDark = !isDark;

        if (isDark) {
            document.body.style.backgroundColor = '#111';
            document.body.style.color = '#fff';
            // Cambia también el color de la barra de nav si deseas
            // ...
            toggleTheme.textContent = 'Aspecto (Oscuro)';
        } else {
            document.body.style.backgroundColor = '#f0f0f0';
            document.body.style.color = '#000';
            // ...
            toggleTheme.textContent = 'Aspecto (Claro)';
        }
    });
});
