let servicios = [
    { id: 1, nombre: "CREDU", descripcion: "Plataforma unificada para consulta de credenciales de acceso a SIGA, KAWAK y SIPA HCM.", icono: "fas fa-id-card", colorIcono: "#f5c542", perfiles: ["profesor"], url: "https://credu-1vj0.onrender.com/login", tipo: "web", activo: true, nuevo: false },
    { id: 2, nombre: "AULA TECH", descripcion: "Plataforma para solicitud y gestión de soporte técnico en aulas y laboratorios.", icono: "fas fa-chalkboard-teacher", colorIcono: "#f5c542", perfiles: ["profesor", "administrativo"], url: "http://172.16.0.30/soporte/", tipo: "web", activo: true, nuevo: false },
    { id: 3, nombre: "CYBER CONTROL BIBLIOTECA", descripcion: "Sistema de control de acceso y monitoreo de seguridad para salas de sistemas.", icono: "fas fa-laptop", colorIcono: "#e05a5a", perfiles: ["administrativo"], url: "http://172.16.0.30/cafecontrol/public/login.php", tipo: "web", activo: true, nuevo: false },
    { id: 4, nombre: "CAMPUS DEPLOY", descripcion: "Automatización de despliegue e instalación de software en equipos institucionales.", icono: "fas fa-cloud-upload-alt", colorIcono: "#f5c542", perfiles: ["administrativo"], url: "#", tipo: "ejecutable", activo: true, nuevo: false },
    { id: 5, nombre: "PROCESADOR DIAN XML", descripcion: "Sistema especializado para la generación, validación y envío masivo de facturación electrónica XML ante la DIAN.", icono: "fas fa-scale-balanced", colorIcono: "#e05a5a", perfiles: ["administrativo"], url: "#", tipo: "ejecutable", activo: true, nuevo: false },
    { id: 6, nombre: "WEB CALEX", descripcion: "Control de acceso para evaluaciones de idiomas que restringe navegación a sitios no autorizados.", icono: "fas fa-flag-checkered", colorIcono: "#f5c542", perfiles: ["profesor"], url: "#", tipo: "web", activo: true, nuevo: false },
    { id: 7, nombre: "CSU", descripcion: "Plataforma para radicación de solicitudes, PQRS, seguimiento de trámites y atención al estudiante.", icono: "fas fa-ticket-alt", colorIcono: "#f5c542", perfiles: ["egresado"], url: "https://pqrs.uniagustiniana.edu.co/open.php?topicId=25", tipo: "web", activo: true, nuevo: false }
];

let estadisticas = {};
let busquedaActual = "";

function cargarDatos() {
    let guardado = localStorage.getItem("tecnounia_servicios");
    if (guardado) servicios = JSON.parse(guardado);
    let statsGuardado = localStorage.getItem("tecnounia_estadisticas");
    if (statsGuardado) estadisticas = JSON.parse(statsGuardado);
    else servicios.forEach(s => estadisticas[s.id] = 0);
}

function guardarDatos() {
    localStorage.setItem("tecnounia_servicios", JSON.stringify(servicios));
    localStorage.setItem("tecnounia_estadisticas", JSON.stringify(estadisticas));
}

function registrarClic(id, perfil) {
    if (estadisticas[id] !== undefined) {
        estadisticas[id]++;
        guardarDatos();
        console.log(`✅ Clic: ${servicios.find(s=>s.id===id)?.nombre} (${perfil})`);
    }
}

function mostrarDesarrollos(perfil) {
    let contenedor = document.getElementById('lista-desarrollos');
    if (!contenedor) return;
    
    let filtrados = servicios.filter(s => s.activo && s.perfiles.includes(perfil));
    
    if (busquedaActual) {
        filtrados = filtrados.filter(s => s.nombre.toLowerCase().includes(busquedaActual.toLowerCase()));
    }
    
    if (filtrados.length === 0) {
        contenedor.innerHTML = `<div style="text-align:center;padding:50px;">No hay servicios disponibles para este perfil.</div>`;
        return;
    }
    
    contenedor.innerHTML = filtrados.map(s => {
        // Determinar texto del botón según el tipo
        let botonTexto = s.tipo === "ejecutable" ? "Solicitar instalación" : "Ingresa aquí";
        let botonIcono = s.tipo === "ejecutable" ? "fas fa-download" : "fas fa-arrow-right";
        let descripcionAdicional = s.tipo === "ejecutable" ? '<p class="instalacion-nota"><i class="fas fa-info-circle"></i> La instalación de esta herramienta debe ser realizada por el equipo de tecnologías a través de <strong>SISOT</strong>.</p>' : '';
        
        return `
        <div class="tarjeta-servicio">
            ${s.nuevo ? `<div class="badge-nuevo"><img src="assets/usa.jpg" style="width:18px;height:18px;border-radius:50%;"> NUEVO</div>` : ''}
            <i class="${s.icono}" style="color:${s.colorIcono}; font-size:52px;"></i>
            <h4>${s.nombre}</h4>
            <p>${s.descripcion}</p>
            ${descripcionAdicional}
            <a href="${s.url}" class="boton-ingresar" data-id="${s.id}" target="${s.tipo === 'web' ? '_blank' : '_self'}">
                <img src="assets/usa.jpg" style="width:28px;height:28px;border-radius:50%;">
                ${botonTexto}
                <i class="${botonIcono}"></i>
            </a>
        </div>
    `}).join('');
    
    document.querySelectorAll('.boton-ingresar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            let id = parseInt(this.getAttribute('data-id'));
            let servicio = servicios.find(s => s.id === id);
            let perfilActivo = document.querySelector('.perfil-btn.activo')?.getAttribute('data-perfil') || 'profesor';
            
            // Registrar clic siempre
            registrarClic(id, perfilActivo);
            
            // Si es ejecutable, mostrar mensaje informativo
            if (servicio && servicio.tipo === "ejecutable") {
                e.preventDefault();
                alert(`🔧 ${servicio.nombre}\n\nEsta herramienta requiere instalación.\n\nPor favor, realice la solicitud a través de SISOT (mesa de ayuda) para que el equipo de tecnologías realice la instalación.`);
            }
        });
    });
}

function configurarBotones() {
    let botones = document.querySelectorAll('.perfil-btn');
    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            botones.forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');
            mostrarDesarrollos(this.getAttribute('data-perfil'));
        });
    });
}

function configurarBuscador() {
    let input = document.getElementById('buscadorInput');
    if (input) input.addEventListener('input', e => { busquedaActual = e.target.value; mostrarDesarrollos(document.querySelector('.perfil-btn.activo')?.getAttribute('data-perfil') || 'profesor'); });
    let limpiar = document.getElementById('limpiarBusqueda');
    if (limpiar) limpiar.addEventListener('click', () => { busquedaActual = ''; input.value = ''; mostrarDesarrollos(document.querySelector('.perfil-btn.activo')?.getAttribute('data-perfil') || 'profesor'); });
}

function actualizarAdminPanel() {
    let statsDiv = document.getElementById('adminEstadisticas');
    if (statsDiv) statsDiv.innerHTML = Object.entries(estadisticas).map(([id, clicks]) => {
        let servicio = servicios.find(s => s.id == id);
        return `<div><strong>${servicio?.nombre}</strong>: ${clicks} clics</div>`;
    }).join('');
    
    let serviciosDiv = document.getElementById('adminServiciosList');
    if (serviciosDiv) serviciosDiv.innerHTML = servicios.map(s => `
        <div><span>${s.nombre}</span> <button onclick="toggleServicio(${s.id})">${s.activo ? 'Desactivar' : 'Activar'}</button></div>
    `).join('');
}

window.toggleServicio = function(id) {
    let s = servicios.find(s => s.id === id);
    if (s) { s.activo = !s.activo; guardarDatos(); actualizarAdminPanel(); mostrarDesarrollos(document.querySelector('.perfil-btn.activo')?.getAttribute('data-perfil') || 'profesor'); }
};

function configurarAdminPanel() {
    let panel = document.getElementById('adminPanel');
    document.addEventListener('keydown', e => { if (e.ctrlKey && e.shiftKey && e.key === 'A') { e.preventDefault(); panel.classList.toggle('open'); actualizarAdminPanel(); } });
    document.getElementById('closeAdminPanel')?.addEventListener('click', () => panel.classList.remove('open'));
    document.getElementById('resetearEstadisticas')?.addEventListener('click', () => { servicios.forEach(s => estadisticas[s.id] = 0); guardarDatos(); actualizarAdminPanel(); });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    configurarBotones();
    configurarBuscador();
    configurarAdminPanel();
    mostrarDesarrollos('profesor');
});