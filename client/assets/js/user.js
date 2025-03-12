document.addEventListener('DOMContentLoaded', () => {
    const sessionBtn = document.getElementById('sessionBtn');
    const sessionModal = document.getElementById('sessionModal');
    const closeModal = document.getElementById('closeModal');
    const toggleTheme = document.getElementById('toggleTheme');
    const userIcon = document.getElementById('userIcon');
    const userModal = document.getElementById('userModal');


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

    // Variable para saber si el modal está abierto o cerrado
    let isModalOpen = false;

    // Al hacer clic en el icono de usuario, alternamos la visibilidad del modal
    userIcon.addEventListener('click', () => {
        isModalOpen = !isModalOpen;
        userModal.style.display = isModalOpen ? 'block' : 'none';
    });

    // Si quieres que el modal se cierre al hacer clic fuera:
    window.addEventListener('click', (e) => {
        // Si el click no fue en el icono ni en el modal, cierra el modal
        if (isModalOpen && e.target !== userIcon && !userModal.contains(e.target)) {
            isModalOpen = false;
            userModal.style.display = 'none';
        }
    });
});
