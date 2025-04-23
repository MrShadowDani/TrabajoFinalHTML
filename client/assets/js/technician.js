document.addEventListener("DOMContentLoaded", () => {
    const mapaContenedor = document.getElementById('mapa-cargadores');
    const contenedorReportes = document.getElementById('lista-reportes');
    const contenedorMensajes = document.getElementById('tabla-mensajes');

    if (mapaContenedor && contenedorReportes) {
        const mapa = L.map('mapa-cargadores').setView([40.4168, -3.7038], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapa);

        fetch("https://api.openchargemap.io/v3/poi/?output=json&countrycode=ES&maxresults=100&compact=true&verbose=false&key=2670b513-1409-41e6-999b-d6e660043aff")
            .then(response => response.json())
            .then(data => {
                const disponibilidad = JSON.parse(localStorage.getItem("estadoCargadores")) || {};

                data.forEach((cargador, index) => {
                    const lat = cargador.AddressInfo.Latitude;
                    const lon = cargador.AddressInfo.Longitude;
                    const nombre = cargador.AddressInfo.Title || `Cargador ${index}`;
                    const tipo = cargador.Connections?.[0]?.ConnectionType?.Title || "Desconocido";

                    const estadoGuardado = disponibilidad[nombre];
                    const disponible = estadoGuardado !== "ocupado";
                    const color = disponible ? "limegreen" : "crimson";

                    const marker = L.circleMarker([lat, lon], {
                        radius: 8,
                        color,
                        fillColor: color,
                        fillOpacity: 0.9
                    }).addTo(mapa);

                    const popupContent = `
                        <strong>${nombre}</strong><br>
                        Tipo: ${tipo}<br>
                        Estado: <span id="estado-${index}" style="color:${color}">${disponible ? 'Disponible' : 'Ocupado'}</span><br><br>
                        <button onclick="verReportes('${nombre.replace(/'/g, "\\'")}')">Ver reportes</button>
                        <button onclick="cambiarEstado('${nombre.replace(/'/g, "\\'")}', ${index})" style="margin-left: 10px; background: orange; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Cambiar estado</button>
                    `;
                    marker.bindPopup(popupContent);
                });
            })
            .catch(err => {
                console.error("Error al cargar puntos de carga:", err);
                contenedorReportes.innerHTML = "<p style='color:red;'>No se pudieron cargar los reportes.</p>";
            });

        window.verReportes = (nombreCargador) => {
            const reportes = JSON.parse(localStorage.getItem('reportesVoltio')) || [];
            const filtrados = reportes.filter(r => r.nombre === nombreCargador);

            contenedorReportes.innerHTML = `<h3>Reportes para: ${nombreCargador}</h3>`;

            if (filtrados.length === 0) {
                contenedorReportes.innerHTML += "<p>No hay reportes para este cargador.</p>";
                return;
            }

            filtrados.forEach((reporte, i) => {
                const div = document.createElement("div");
                div.className = "reporte";
                div.innerHTML = `
                    <p><strong>Motivo:</strong> ${reporte.motivo}</p>
                    <p><small>Fecha: ${reporte.fecha}</small></p>
                    <button onclick="eliminarReporte('${nombreCargador}', ${i})" style="margin-top:5px;">Eliminar</button>
                    <hr>
                `;
                contenedorReportes.appendChild(div);
            });
        };

        window.eliminarReporte = (nombre, indexRelativo) => {
            let reportes = JSON.parse(localStorage.getItem('reportesVoltio')) || [];
            const filtrados = reportes.filter(r => r.nombre === nombre);
            const globalIndex = reportes.findIndex((r, i) => r.nombre === nombre && i === reportes.indexOf(filtrados[indexRelativo]));
            if (globalIndex !== -1) {
                reportes.splice(globalIndex, 1);
                localStorage.setItem('reportesVoltio', JSON.stringify(reportes));
                verReportes(nombre);
            }
        };

        window.cambiarEstado = (nombre, index) => {
            const disponibilidad = JSON.parse(localStorage.getItem("estadoCargadores")) || {};
            const estadoActual = disponibilidad[nombre] === "ocupado" ? "ocupado" : "disponible";
            const nuevoEstado = estadoActual === "disponible" ? "ocupado" : "disponible";

            const confirmar = confirm(`¿Deseas cambiar el estado de "${nombre}" a ${nuevoEstado}?`);
            if (!confirmar) return;

            disponibilidad[nombre] = nuevoEstado === "ocupado" ? "ocupado" : undefined;
            localStorage.setItem("estadoCargadores", JSON.stringify(disponibilidad));

            const colorNuevo = nuevoEstado === "ocupado" ? "crimson" : "limegreen";
            const estadoSpan = document.getElementById(`estado-${index}`);
            if (estadoSpan) {
                estadoSpan.textContent = nuevoEstado.charAt(0).toUpperCase() + nuevoEstado.slice(1);
                estadoSpan.style.color = colorNuevo;
            }

            alert(`✅ El estado de "${nombre}" se ha actualizado a ${nuevoEstado}.`);
        };
    }

    if (contenedorMensajes) {
        const mensajes = JSON.parse(localStorage.getItem('mensajesVoltio')) || [];
        if (mensajes.length === 0) {
            contenedorMensajes.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No hay mensajes aún.</td></tr>";
        } else {
            contenedorMensajes.innerHTML = "";
            mensajes.forEach((m, i) => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${m.nombre}</td>
                    <td>${m.apellido}</td>
                    <td>${m.email}</td>
                    <td>${m.asunto}</td>
                    <td>${m.mensaje}</td>
                    <td>${m.fecha}</td>
                    <td><button onclick="eliminarMensaje(${i})" style="background:crimson;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">Eliminar</button></td>
                `;
                contenedorMensajes.appendChild(fila);
            });
        }
    }

    window.eliminarMensaje = (index) => {
        let mensajes = JSON.parse(localStorage.getItem('mensajesVoltio')) || [];
        if (index >= 0 && index < mensajes.length) {
            mensajes.splice(index, 1);
            localStorage.setItem('mensajesVoltio', JSON.stringify(mensajes));
            location.reload();
        }
    }
});
// FORMULARIO DE CONTACTO
const contactoForm = document.querySelector(".formulario");

contactoForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("email").value.trim();
    const asunto = document.getElementById("asunto").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !apellido || !email || !asunto || !mensaje) {
        alert("❌ Por favor, completa todos los campos del formulario.");
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

    contactoForm.reset();
    alert("✅ Mensaje enviado correctamente. Nuestro equipo técnico lo revisará.");
});

document.addEventListener("DOMContentLoaded", () => {
    const contenedorMensajes = document.getElementById("mensajesRecibidos");
    const mensajes = JSON.parse(localStorage.getItem("mensajesVoltio")) || [];

    if (mensajes.length === 0) return;

    contenedorMensajes.innerHTML = "";

    mensajes.forEach(mensaje => {
        const div = document.createElement("div");
        div.style.borderBottom = "1px solid #ccc";
        div.style.padding = "10px 0";
        div.innerHTML = `
                <p><strong>Nombre:</strong> ${mensaje.nombre} ${mensaje.apellido}</p>
                <p><strong>Email:</strong> ${mensaje.email}</p>
                <p><strong>Asunto:</strong> ${mensaje.asunto}</p>
                <p><strong>Mensaje:</strong><br>${mensaje.mensaje}</p>
                <p style="font-size: 0.9em; color: gray;"><em>Fecha: ${mensaje.fecha}</em></p>
            `;
        contenedorMensajes.appendChild(div);
    });
});
function cargarMensajes() {
    const mensajes = JSON.parse(localStorage.getItem('mensajesVoltio')) || [];
    const cuerpoTabla = document.getElementById('cuerpoTablaMensajes');
    cuerpoTabla.innerHTML = "";

    const nombreFiltro = document.getElementById("filtroNombre")?.value.toLowerCase() || "";
    const emailFiltro = document.getElementById("filtroEmail")?.value.toLowerCase() || "";
    const asuntoFiltro = document.getElementById("filtroAsunto")?.value.toLowerCase() || "";

    mensajes.forEach((msg, index) => {
        const coincideNombre = msg.nombre.toLowerCase().includes(nombreFiltro);
        const coincideEmail = msg.email.toLowerCase().includes(emailFiltro);
        const coincideAsunto = msg.asunto.toLowerCase().includes(asuntoFiltro);

        if (coincideNombre && coincideEmail && coincideAsunto) {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${msg.nombre}</td>
                <td>${msg.apellido}</td>
                <td>${msg.email}</td>
                <td>${msg.asunto}</td>
                <td>${msg.mensaje}</td>
                <td><button onclick="eliminarMensaje(${index})">🗑️</button></td>
            `;
            cuerpoTabla.appendChild(fila);
        }
    });
}


function eliminarMensaje(index) {
    const mensajes = JSON.parse(localStorage.getItem('mensajesVoltio')) || [];
    mensajes.splice(index, 1);
    localStorage.setItem('mensajesVoltio', JSON.stringify(mensajes));
    cargarMensajes();
}

// Cargar al iniciar
document.addEventListener("DOMContentLoaded", cargarMensajes);
document.getElementById("filtroNombre")?.addEventListener("input", cargarMensajes);
document.getElementById("filtroEmail")?.addEventListener("input", cargarMensajes);
document.getElementById("filtroAsunto")?.addEventListener("input", cargarMensajes);

document.addEventListener("DOMContentLoaded", () => {
    const userIcon = document.getElementById("userIcon");
    const dropdown = document.getElementById("dropdownMenu");
    const configModal = document.getElementById("configModal");

    const abrirConfig = dropdown.querySelector("a:first-child");
    const cerrarSesion = dropdown.querySelector("a:last-child");

    userIcon?.addEventListener("click", () => {
        dropdown.classList.toggle("show");
    });

    window.addEventListener("click", (e) => {
        if (!userIcon.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });

    abrirConfig?.addEventListener("click", (e) => {
        e.preventDefault();
        configModal.style.display = "flex";
    });

    cerrarSesion?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "../index.html";
    });
});

function cerrarModal() {
    document.getElementById("configModal").style.display = "none";
}