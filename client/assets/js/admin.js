document.addEventListener("DOMContentLoaded", () => {
    // TABLA DE RESERVAS
    const tablaBody = document.querySelector("#tablaReservas tbody");
    if (tablaBody) {
        const reservas = JSON.parse(localStorage.getItem("reservasVoltio")) || [];

        if (reservas.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 6;
            cell.textContent = "No hay reservas registradas.";
            cell.style.textAlign = "center";
            row.appendChild(cell);
            tablaBody.appendChild(row);
        } else {
            reservas.forEach(reserva => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${reserva.tipo || "N/A"}</td>
                    <td>${reserva.horas || "0"}</td>
                    <td>${reserva.minutos || "0"}</td>
                    <td>${reserva.precio || "0€"}</td>
                    <td>${reserva.metodo || "N/A"}</td>
                    <td>${reserva.fecha || "Sin fecha"}</td>
                `;
                tablaBody.appendChild(row);
            });
        }
    }
    // TABLA DE USUARIOS ACTIVOS
    const usuarios = JSON.parse(localStorage.getItem("usuariosActivos")) || [];
    const cuerpoUsuarios = document.querySelector("#tablaUsuarios tbody");
    if (cuerpoUsuarios) {
        if (usuarios.length === 0) {
            cuerpoUsuarios.innerHTML = `<tr><td colspan="2">No hay accesos registrados.</td></tr>`;
        } else {
            usuarios.forEach(usuario => {
                const fila = document.createElement("tr");
                fila.innerHTML = `<td>${usuario.email}</td><td>${usuario.fecha}</td>`;
                cuerpoUsuarios.appendChild(fila);
            });
        }
    }
    // TABLA DE INCIDENCIAS
    const incidencias = JSON.parse(localStorage.getItem("incidenciasVoltio")) || [];
    const cuerpoIncidencias = document.querySelector("#tablaIncidencias tbody");
    if (cuerpoIncidencias) {
        if (incidencias.length === 0) {
            cuerpoIncidencias.innerHTML = `<tr><td colspan="3">No se han reportado incidencias.</td></tr>`;
        } else {
            incidencias.forEach(i => {
                const fila = document.createElement("tr");
                fila.innerHTML = `<td>${i.punto}</td><td>${i.mensaje}</td><td>${i.fecha}</td>`;
                cuerpoIncidencias.appendChild(fila);
            });
        }
    }
    // MENÚ SUPERIOR
    const userIcon = document.getElementById("userIcon");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const configModal = document.getElementById("configModal");
    userIcon?.addEventListener("click", () => {
        dropdownMenu.classList.toggle("show");
    });
    window.addEventListener("click", (e) => {
        if (!userIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
    document.querySelector('#dropdownMenu a[href="#configuracion"]')?.addEventListener("click", (e) => {
        e.preventDefault();
        configModal.style.display = "flex";
    });
    document.querySelector('#dropdownMenu a[href="#cerrar"]')?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "../index.html";
    });
    window.cerrarModalAdmin = () => configModal.style.display = "none";
    window.guardarConfiguracionAdmin = () => alert("✅ Configuración guardada correctamente.");
    window.descargarDatosAdmin = () => alert("📁 Tus datos han sido descargados.");
    window.eliminarCuentaAdmin = () => confirm("¿Seguro que deseas eliminar tu cuenta?") && alert("🗑 Cuenta eliminada.");
    // MAPA DE PUNTOS DE CARGA
    const mapaContenedor = document.getElementById("mapa-cargadores-admin");
    if (!mapaContenedor) return;
    const mapa = L.map("mapa-cargadores-admin").setView([40.4168, -3.7038], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapa);
    let modoAgregar = false;
    document.getElementById("btnAgregarPunto")?.addEventListener("click", () => {
        modoAgregar = !modoAgregar;
        alert(modoAgregar ? "🟢 Haz clic en el mapa para añadir un nuevo punto." : "❌ Modo añadir cancelado.");
    });
    fetch("https://api.openchargemap.io/v3/poi/?output=json&countrycode=ES&maxresults=100&compact=true&verbose=false&key=2670b513-1409-41e6-999b-d6e660043aff")
        .then((response) => response.json())
        .then((data) => {
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
                    fillOpacity: 0.9,
                }).addTo(mapa);

                const popupContent = `
                    <strong>${nombre}</strong><br>
                    Tipo: ${tipo}<br>
                    Estado: <span id="estado-${index}" style="color:${color}">${disponible ? "Disponible" : "Ocupado"}</span><br><br>
                    <button onclick="cambiarEstado('${nombre.replace(/'/g, "\\'")}', ${index})" style="background: orange; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Cambiar estado</button>
                `;
                marker.bindPopup(popupContent);
            });

            renderizarPersonalizados();
        });
    mapa.on("click", (e) => {
        if (!modoAgregar) return;

        const nombre = prompt("🆕 Introduce el nombre del nuevo punto de carga:");
        if (!nombre) return;

        const nuevo = {
            nombre,
            lat: e.latlng.lat,
            lon: e.latlng.lng,
            tipo: "Personalizado"
        };

        const personalizados = JSON.parse(localStorage.getItem("puntosPersonalizados")) || [];
        personalizados.push(nuevo);
        localStorage.setItem("puntosPersonalizados", JSON.stringify(personalizados));
        renderizarPersonalizados();
        alert("✅ Punto añadido correctamente.");
        modoAgregar = false;
    });
    function renderizarPersonalizados() {
        const datos = JSON.parse(localStorage.getItem("puntosPersonalizados")) || [];

        datos.forEach((punto, idx) => {
            const marker = L.circleMarker([punto.lat, punto.lon], {
                radius: 9,
                color: "blue",
                fillColor: "blue",
                fillOpacity: 0.8,
            }).addTo(mapa);

            marker.bindPopup(`
                <strong>${punto.nombre}</strong><br>
                Tipo: ${punto.tipo}<br><br>
                <button onclick="eliminarPersonalizado(${idx})" style="background:red; color:white; border:none; padding:5px 10px; border-radius:5px;">Eliminar</button>
            `);
        });
    }
    window.eliminarPersonalizado = (index) => {
        const datos = JSON.parse(localStorage.getItem("puntosPersonalizados")) || [];
        const confirmar = confirm(`¿Eliminar el punto "${datos[index].nombre}"?`);
        if (!confirmar) return;

        datos.splice(index, 1);
        localStorage.setItem("puntosPersonalizados", JSON.stringify(datos));
        location.reload();
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
});