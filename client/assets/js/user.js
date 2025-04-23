document.addEventListener("DOMContentLoaded", function () {
    // MENÚ USUARIO
    const userIcon = document.getElementById("userIcon");
    const dropdown = document.getElementById("dropdownMenu");
    const abrirConfigBtn = document.getElementById("abrirConfig");
    const cerrarSesionBtn = document.getElementById("cerrarSesion");
    const configModal = document.getElementById("configModal");

    userIcon.addEventListener("click", () => {
        dropdown.classList.toggle("show");
    });

    window.addEventListener("click", (e) => {
        if (!userIcon.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });

    abrirConfigBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        configModal.style.display = "flex";
    });

    cerrarSesionBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace("../index.html");
    });

    // FORMULARIO DE RESERVA
    const tipoCargadorSelect = document.getElementById("tipoCargador");
    const horasInput = document.getElementById("horas");
    const minutosInput = document.getElementById("minutos");
    const direccionInput = document.getElementById("buscarUbicacion");
    const precioTotalDiv = document.getElementById("precioTotal");
    const reservaForm = document.getElementById("reservaForm");
    const metodoPagoRadios = document.querySelectorAll('input[name="pago"]');
    const paypalContainer = document.getElementById("paypal-button-container");
    const botonReservaFinal = document.getElementById("guardarReserva");

    let cargadores = [];

    function calcularPrecio() {
        const selectedOption = tipoCargadorSelect.options[tipoCargadorSelect.selectedIndex];
        if (!selectedOption || !selectedOption.value) {
            precioTotalDiv.textContent = "0€";
            return;
        }
        const precioPorHora = parseFloat(selectedOption.getAttribute("data-precio")) || 0;
        const horas = parseFloat(horasInput.value) || 0;
        const minutos = parseFloat(minutosInput.value) || 0;
        const totalHoras = horas + (minutos / 60);
        const precioTotal = precioPorHora * totalHoras;
        precioTotalDiv.textContent = precioTotal.toFixed(2) + "€";
    }

    tipoCargadorSelect.addEventListener("change", calcularPrecio);
    horasInput.addEventListener("input", calcularPrecio);
    minutosInput.addEventListener("input", calcularPrecio);

    metodoPagoRadios?.forEach(radio => {
        radio.addEventListener("change", () => {
            paypalContainer.style.display = radio.value === "paypal" ? "block" : "none";
        });
    });

    if (window.paypal) {
        paypal.Buttons({
            createOrder: function (data, actions) {
                const total = parseFloat(precioTotalDiv.textContent.replace("€", "")) || 0;
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total.toFixed(2)
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    alert('Pago completado por ' + details.payer.name.given_name);
                });
            }
        }).render("#paypal-button-container");
    }

    botonReservaFinal?.addEventListener("click", () => {
        const tipoCargador = tipoCargadorSelect.value;
        const horas = horasInput.value.trim();
        const minutos = minutosInput.value.trim();
        const direccion = direccionInput.value.trim();
        const precioTotal = precioTotalDiv.textContent;

        if (!tipoCargador || horas === "" || minutos === "" || direccion === "") {
            alert("❌ Por favor, completa todos los campos requeridos.");
            return;
        }

        const metodoPago = document.querySelector('input[name="pago"]:checked')?.value || "Ninguno";
        const nuevaReserva = {
            tipo: tipoCargador,
            horas,
            minutos,
            direccion,
            precio: precioTotal,
            metodo: metodoPago,
            fecha: new Date().toLocaleString()
        };

        const reservas = JSON.parse(localStorage.getItem("reservasVoltio")) || [];
        reservas.push(nuevaReserva);
        localStorage.setItem("reservasVoltio", JSON.stringify(reservas));

        const disponibilidad = JSON.parse(localStorage.getItem("estadoCargadores")) || {};
        disponibilidad[direccion] = "ocupado";
        localStorage.setItem("estadoCargadores", JSON.stringify(disponibilidad));

        alert("✅ Reserva guardada correctamente.");
    });

    // MAPA PRINCIPAL
    const mapa = L.map('map').setView([40.4168, -3.7038], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);

    fetch("https://api.openchargemap.io/v3/poi/?output=json&countrycode=ES&maxresults=100&compact=true&verbose=false&key=2670b513-1409-41e6-999b-d6e660043aff")
        .then(response => response.json())
        .then(data => {
            cargadores = data;
            const disponibilidad = JSON.parse(localStorage.getItem("estadoCargadores")) || {};

            cargadores.forEach((cargador, index) => {
                const lat = cargador.AddressInfo.Latitude;
                const lon = cargador.AddressInfo.Longitude;
                const nombre = cargador.AddressInfo.Title || `Cargador ${index}`;
                const tipo = cargador.Connections?.[0]?.ConnectionType?.Title || "Desconocido";
                const estadoGuardado = disponibilidad[nombre];
                const disponible = estadoGuardado !== "ocupado";
                const color = disponible ? "limegreen" : "crimson";

                const marker = L.circleMarker([lat, lon], {
                    radius: 9,
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.9
                }).addTo(mapa);

                const popupContent = `
                    <strong>${nombre}</strong><br>
                    Tipo: ${tipo}<br>
                    Estado: <span style="color:${color}">${disponible ? 'Disponible' : 'Ocupado'}</span><br><br>
                    <button onclick="reportar(${index})" style="padding:6px 10px;background:#d9534f;color:white;border:none;border-radius:5px;cursor:pointer;">Reportar</button>
                `;

                marker.bindPopup(popupContent);
            });
        });

    window.reportar = (index) => {
        const cargador = cargadores[index];
        const nombre = cargador.AddressInfo.Title || `Cargador ${index}`;
        const motivo = prompt(`🔧 Reporte para "${nombre}"\nDescribe el problema:`);

        if (motivo && motivo.trim() !== "") {
            const nuevoReporte = {
                nombre,
                motivo: motivo.trim(),
                fecha: new Date().toLocaleString()
            };
            const reportes = JSON.parse(localStorage.getItem('reportesVoltio')) || [];
            reportes.push(nuevoReporte);
            localStorage.setItem('reportesVoltio', JSON.stringify(reportes));
            alert("✅ Gracias por tu reporte. El equipo técnico lo revisará.");
        } else {
            alert("❌ Por favor, proporciona una descripción válida del problema.");
        }
    };

    window.cerrarModal = () => {
        document.getElementById("configModal").style.display = "none";
    };
});
// FORMULARIO DE CONTACTO
const formularioContacto = document.querySelector(".formulario");
if (formularioContacto) {
    formularioContacto.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const email = document.getElementById("email").value.trim();
        const asunto = document.getElementById("asunto").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();

        if (!nombre || !apellido || !email || !asunto || !mensaje) {
            alert("❌ Por favor, completa todos los campos.");
            return;
        }

        const nuevoMensaje = {
            nombre,
            apellido,
            email,
            asunto,
            mensaje,
            fecha: new Date().toLocaleString()
        };

        const mensajes = JSON.parse(localStorage.getItem("mensajesVoltio")) || [];
        mensajes.push(nuevoMensaje);
        localStorage.setItem("mensajesVoltio", JSON.stringify(mensajes));

        alert("✅ Tu mensaje ha sido enviado correctamente.");
        formularioContacto.reset();
    });
}