document.addEventListener("DOMContentLoaded", function() {
    // Código existente para el menú de usuario
    const userIcon = document.getElementById("userIcon");
    const dropdown = document.getElementById("dropdownMenu");

    userIcon.addEventListener("click", () => {
        dropdown.classList.toggle("show");
    });

    window.addEventListener("click", (e) => {
        if (!userIcon.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });

    // Funcionalidad del formulario de reserva
    const tipoCargadorSelect = document.getElementById("tipoCargador");
    const horasInput = document.getElementById("horas");
    const minutosInput = document.getElementById("minutos");
    const precioTotalDiv = document.getElementById("precioTotal");
    const reservaForm = document.getElementById("reservaForm");

    function calcularPrecio() {
        const selectedOption = tipoCargadorSelect.options[tipoCargadorSelect.selectedIndex];
        if (!selectedOption || !selectedOption.value) {
            precioTotalDiv.textContent = "0€";
            return;
        }
        // Se obtiene el precio por hora desde el atributo data-precio
        const precioPorHora = parseFloat(selectedOption.getAttribute("data-precio")) || 0;
        const horas = parseFloat(horasInput.value) || 0;
        const minutos = parseFloat(minutosInput.value) || 0;
        const totalHoras = horas + (minutos / 60);
        const precioTotal = precioPorHora * totalHoras;
        precioTotalDiv.textContent = precioTotal.toFixed(2) + "€";
    }

    // Actualizar el precio cuando cambien los valores
    tipoCargadorSelect.addEventListener("change", calcularPrecio);
    horasInput.addEventListener("input", calcularPrecio);
    minutosInput.addEventListener("input", calcularPrecio);

    // Envío del formulario
    reservaForm.addEventListener("submit", function(e) {
        e.preventDefault();
        // Aquí agregarás la lógica para procesar la reserva y redirigir si es necesario.
        alert("Reserva realizada. Total a pagar: " + precioTotalDiv.textContent);
    });
});
