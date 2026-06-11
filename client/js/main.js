const API_URL = 'http://localhost:3000/api';

// ── TOKEN ──
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');
const getRol = () => localStorage.getItem('rol');
const setRol = (rol) => localStorage.setItem('rol', rol);

// ── FETCH HELPER ──
const fetchAPI = async (endpoint, options = {}) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
            ...options.headers
        }
    });
    if (res.status === 401) { mostrarLogin(); return null; }
    return res.json();
};

// ── PANTALLAS ──
const mostrarDashboard = () => {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');
};

const mostrarLogin = () => {
    removeToken();
    setRol('');
    document.getElementById('dashboard-screen').classList.remove('active');
    document.getElementById('login-screen').classList.add('active');
};

// ── MODAL ──
let modalCallback = null;

const abrirModal = (titulo, camposHTML, onSubmit) => {
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-campos').innerHTML = camposHTML;
    document.getElementById('modal-overlay').classList.remove('hidden');
    modalCallback = onSubmit;
};

const cerrarModal = () => {
    document.getElementById('modal-overlay').classList.add('hidden');
    modalCallback = null;
};

document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) cerrarModal();
});

document.getElementById('modal-cancelar').addEventListener('click', cerrarModal);

document.getElementById('modal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (modalCallback) await modalCallback();
});

// ── TOAST ──
const toast = (msg, tipo = 'ok') => {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = `toast toast-${tipo} show`;
    setTimeout(() => el.classList.remove('show'), 3000);
};

// ── NAVEGACIÓN ──
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('section-' + btn.dataset.section).classList.add('active');
        cargarSeccion(btn.dataset.section);
    });
});

// ── LOGIN ──
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');

    btn.textContent = 'Entrando...';
    btn.disabled = true;
    errorEl.classList.add('hidden');

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            errorEl.textContent = data.error || 'Email o contraseña incorrectos';
            errorEl.classList.remove('hidden');
            return;
        }

        setToken(data.token);
        setRol(data.usuario.rol);
        localStorage.setItem('email', email);
        document.getElementById('user-email-display').textContent = email;
        document.getElementById('user-role-badge').textContent = data.usuario.rol;
        mostrarDashboard();
        cargarSeccion('alumnos');

    } catch (err) {
        errorEl.textContent = 'Error de conexión con el servidor';
        errorEl.classList.remove('hidden');
    } finally {
        btn.textContent = 'Entrar';
        btn.disabled = false;
    }
});

// ── LOGOUT ──
document.getElementById('logout-btn').addEventListener('click', () => mostrarLogin());

// ── CARGA DE SECCIONES ──
const cargarSeccion = (seccion) => {
    if (seccion === 'alumnos') cargarAlumnos();
    if (seccion === 'profesores') cargarProfesores();
    if (seccion === 'promociones') cargarPromociones();
    if (seccion === 'proyectos') cargarProyectos();
};

const esAdmin = () => getRol() === 'admin';

// ══════════════════════════════════════════
// ALUMNOS
// ══════════════════════════════════════════
const cargarAlumnos = async () => {
    const lista = document.getElementById('alumnos-list');
    lista.innerHTML = '<div class="loading">Cargando...</div>';
    const data = await fetchAPI('/alumnos');
    if (!data) return;

    if (data.length === 0) {
        lista.innerHTML = '<div class="loading">No hay alumnos registrados.</div>';
        return;
    }

    lista.innerHTML = data.map(a => `
        <div class="data-card">
            <div class="data-card-info">
                <span class="data-card-name">${a.nombre}</span>
                <span class="data-card-sub">${a.email} · ${a.promocion?.nombre || 'Sin promoción'}</span>
            </div>
            ${esAdmin() || getRol() === 'profesor' ? `
            <div class="data-card-actions">
                <button class="btn-edit" onclick="editarAlumno('${a._id}', '${a.nombre}', '${a.email}', '${a.promocion?._id || ''}')">Editar</button>
                ${esAdmin() ? `<button class="btn-delete" onclick="eliminarAlumno('${a._id}', '${a.nombre}')">Eliminar</button>` : ''}
            </div>` : ''}
        </div>
    `).join('');
};

document.getElementById('btn-nuevo-alumno').addEventListener('click', async () => {
    if (!esAdmin()) return toast('Solo los administradores pueden crear alumnos', 'error');
    const promociones = await fetchAPI('/promociones');
    const opcionesPromocion = promociones?.map(p => `<option value="${p._id}">${p.nombre}</option>`).join('') || '';

    abrirModal('Nuevo alumno', `
        <div class="field">
            <label>Nombre</label>
            <input type="text" id="f-nombre" placeholder="Ana García López" required>
        </div>
        <div class="field">
            <label>Email</label>
            <input type="email" id="f-email" placeholder="ana@email.com" required>
        </div>
        <div class="field">
            <label>Promoción</label>
            <select id="f-promocion" required>
                <option value="">Selecciona una promoción</option>
                ${opcionesPromocion}
            </select>
        </div>
    `, async () => {
        const body = {
            nombre: document.getElementById('f-nombre').value,
            email: document.getElementById('f-email').value,
            promocion: document.getElementById('f-promocion').value
        };
        const res = await fetchAPI('/alumnos', { method: 'POST', body: JSON.stringify(body) });
        if (res?.error) return toast(res.error, 'error');
        cerrarModal();
        toast('Alumno creado correctamente');
        cargarAlumnos();
    });
});

const editarAlumno = async (id, nombre, email, promocionId) => {
    const [promociones, proyectos] = await Promise.all([
        fetchAPI('/promociones'),
        fetchAPI('/proyectos')
    ]);

    const proyectosDePromocion = proyectos?.filter(p =>
        p.promocion?._id?.toString() === promocionId.toString()
    ) || [];

    const listaProyectos = proyectosDePromocion.length > 0
        ? proyectosDePromocion.map(p => `
            <div style="font-size:0.875rem; padding:4px 0; border-bottom:1px solid var(--border)">
                • ${p.nombre}
            </div>`).join('')
        : '<p class="confirm-msg">No hay proyectos en esta promoción</p>';

    abrirModal('Editar alumno', `
        <div class="field">
            <label>Nombre</label>
            <input type="text" id="f-nombre" value="${nombre}" required>
        </div>
        <div class="field">
            <label>Email</label>
            <input type="email" id="f-email" value="${email}" required>
        </div>
        <div class="field">
            <label>Promoción</label>
            <input type="text" value="${promociones?.find(p => p._id === promocionId)?.nombre || 'Sin promoción'}"
                readonly style="opacity:0.5; cursor:not-allowed">
        </div>
        <div class="field">
            <label>Proyectos de la promoción</label>
            <div>${listaProyectos}</div>
        </div>
    `, async () => {
        const body = {
            nombre: document.getElementById('f-nombre').value,
            email: document.getElementById('f-email').value
        };
        const resAlumno = await fetchAPI(`/alumnos/${id}`, { method: 'PUT', body: JSON.stringify(body) });
        if (resAlumno?.error) return toast(resAlumno.error, 'error');
        cerrarModal();
        toast('Alumno actualizado');
        cargarAlumnos();
    });
};

const eliminarAlumno = (id, nombre) => {
    abrirModal('Eliminar alumno', `
        <p class="confirm-msg">¿Seguro que quieres eliminar a <strong>${nombre}</strong>? Esta acción no se puede deshacer.</p>
    `, async () => {
        const res = await fetchAPI(`/alumnos/${id}`, { method: 'DELETE' });
        if (res?.error) return toast(res.error, 'error');
        cerrarModal();
        toast('Alumno eliminado');
        cargarAlumnos();
    });
};

// ══════════════════════════════════════════
// PROFESORES
// ══════════════════════════════════════════
const cargarProfesores = async () => {
    const lista = document.getElementById('profesores-list');
    lista.innerHTML = '<div class="loading">Cargando...</div>';
    const data = await fetchAPI('/profesores');
    if (!data) return;

    if (data.length === 0) {
        lista.innerHTML = '<div class="loading">No hay profesores registrados.</div>';
        return;
    }

    lista.innerHTML = data.map(p => `
        <div class="data-card">
            <div class="data-card-info">
                <span class="data-card-name">${p.nombre}</span>
                <span class="data-card-sub">${p.email}</span>
            </div>
            ${esAdmin() ? `
            <div class="data-card-actions">
                <button class="btn-edit" onclick="editarProfesor('${p._id}', '${p.nombre}', '${p.email}')">Editar</button>
                <button class="btn-delete" onclick="eliminarProfesor('${p._id}', '${p.nombre}')">Eliminar</button>
            </div>` : ''}
        </div>
    `).join('');
};

document.getElementById('btn-nuevo-profesor').addEventListener('click', () => {
    if (!esAdmin()) return toast('Solo los administradores pueden crear profesores', 'error');

    abrirModal('Nuevo profesor', `
    <div class="field">
        <label>Nombre</label>
        <input type="text" id="f-nombre" placeholder="Carlos Martínez" required>
    </div>
    <div class="field">
        <label>Email</label>
        <input type="email" id="f-email" placeholder="carlos@aprentic.com" required>
    </div>
    <div class="field">
        <label>Contraseña</label>
        <input type="password" id="f-password" placeholder="••••••••" required>
    </div>
`, async () => {
        const body = {
            nombre: document.getElementById('f-nombre').value,
            email: document.getElementById('f-email').value,
            password: document.getElementById('f-password').value
        };
        const res = await fetchAPI('/profesores', { method: 'POST', body: JSON.stringify(body) });
        if (res?.error) return toast(res.error, 'error');
        cerrarModal();
        toast('Profesor creado correctamente');
        cargarProfesores();
    });
});

const editarProfesor = (id, nombre, email) => {
    abrirModal('Editar profesor', `
        <div class="field">
            <label>Nombre</label>
            <input type="text" id="f-nombre" value="${nombre}" required>
        </div>
        <div class="field">
            <label>Email</label>
            <input type="email" id="f-email" value="${email}" required>
        </div>
    `, async () => {
        const body = {
            nombre: document.getElementById('f-nombre').value,
            email: document.getElementById('f-email').value
        };
        const res = await fetchAPI(`/profesores/${id}`, { method: 'PUT', body: JSON.stringify(body) });
        if (res?.error) return toast(res.error, 'error');
        cerrarModal();
        toast('Profesor actualizado');
        cargarProfesores();
    });
};

const eliminarProfesor = (id, nombre) => {
    abrirModal('Eliminar profesor', `
        <p class="confirm-msg">¿Seguro que quieres eliminar a <strong>${nombre}</strong>?</p>
    `, async () => {
        const res = await fetchAPI(`/profesores/${id}`, { method: 'DELETE' });
        if (res?.error) return toast(res.error, 'error');
        cerrarModal();
        toast('Profesor eliminado');
        cargarProfesores();
    });
};

// ══════════════════════════════════════════
// PROMOCIONES
// ══════════════════════════════════════════
const cargarPromociones = async () => {
    const lista = document.getElementById('promociones-list');
    lista.innerHTML = '<div class="loading">Cargando...</div>';
    const data = await fetchAPI('/promociones');
    if (!data) return;

    if (data.length === 0) {
        lista.innerHTML = '<div class="loading">No hay promociones registradas.</div>';
        return;
    }

    lista.innerHTML = data.map(p => `
        <div class="data-card">
            <div class="data-card-info">
                <span class="data-card-name">${p.nombre}</span>
                <span class="data-card-sub">${p.campus?.nombre || 'Sin campus'} · ${formatFecha(p.fechaInicio)} → ${formatFecha(p.fechaFin)}</span>
            </div>
            ${esAdmin() ? `
            <div class="data-card-actions">
                <button class="btn-edit" onclick="editarPromocion('${p._id}', '${p.nombre}', '${p.fechaInicio}', '${p.fechaFin}', '${p.campus?.nombre || 'Sin campus'}')">Editar</button>
                <button class="btn-delete" onclick="eliminarPromocion('${p._id}', '${p.nombre}')">Eliminar</button>
            </div>` : ''}
        </div>
    `).join('');
};

const formatFecha = (fecha) => fecha ? new Date(fecha).toLocaleDateString('es-ES') : '-';
const isoFecha = (fecha) => fecha ? new Date(fecha).toISOString().split('T')[0] : '';

document.getElementById('btn-nueva-promocion').addEventListener('click', async () => {
    if (!esAdmin()) return toast('Solo los administradores pueden crear promociones', 'error');
    const promociones = await fetchAPI('/promociones');
    const campus = [...new Map(promociones?.map(p => [p.campus?._id, p.campus]).filter(([id]) => id)).values()];
    const opcionesCampus = campus.map(c => `<option value="${c._id}">${c.nombre}</option>`).join('');
    //const opcionesCampus = campus?.map(c => `<option value="${c._id}">${c.nombre}</option>`).join('') || '';

    abrirModal('Nueva promoción', `
        <div class="field">
            <label>Nombre</label>
            <input type="text" id="f-nombre" placeholder="Fullstack 2025-1" required>
        </div>
        <div class="field">
            <label>Fecha inicio</label>
            <input type="date" id="f-inicio" required>
        </div>
        <div class="field">
            <label>Fecha fin</label>
            <input type="date" id="f-fin" required>
        </div>
        <div class="field">
            <label>Campus</label>
            <select id="f-campus" required>
                <option value="">Selecciona un campus</option>
                ${opcionesCampus}
            </select>
        </div>
    `, async () => {
        const body = {
            nombre: document.getElementById('f-nombre').value,
            fechaInicio: document.getElementById('f-inicio').value,
            fechaFin: document.getElementById('f-fin').value,
            campus: document.getElementById('f-campus').value
        };
        const res = await fetchAPI('/promociones', { method: 'POST', body: JSON.stringify(body) });
        if (res?.error) return toast(res.error, 'error');
        cerrarModal();
        toast('Promoción creada correctamente');
        cargarPromociones();
    });
});

const editarPromocion = async (id, nombre, fechaInicio, fechaFin, campusNombre) => {
    abrirModal('Editar promoción', `
        <div class="field">
            <label>Nombre</label>
            <input type="text" id="f-nombre" value="${nombre}" required>
        </div>
        <div class="field">
            <label>Fecha inicio</label>
            <input type="date" id="f-inicio" value="${isoFecha(fechaInicio)}" required>
        </div>
        <div class="field">
            <label>Fecha fin</label>
            <input type="date" id="f-fin" value="${isoFecha(fechaFin)}" required>
        </div>
        <div class="field">
            <label>Campus</label>
            <input type="text" value="${campusNombre}" readonly style="opacity:0.5; cursor:not-allowed">
        </div>
    `, async () => {
        const body = {
            nombre: document.getElementById('f-nombre').value,
            fechaInicio: document.getElementById('f-inicio').value,
            fechaFin: document.getElementById('f-fin').value
        };
        const res = await fetchAPI(`/promociones/${id}`, { method: 'PUT', body: JSON.stringify(body) });
        if (res?.error) return toast(res.error, 'error');
        cerrarModal();
        toast('Promoción actualizada');
        cargarPromociones();
    });
};

const eliminarPromocion = (id, nombre) => {
    abrirModal('Eliminar promoción', `
        <p class="confirm-msg">¿Seguro que quieres eliminar <strong>${nombre}</strong>?</p>
    `, async () => {
        const res = await fetchAPI(`/promociones/${id}`, { method: 'DELETE' });
        if (res?.error) return toast(res.error, 'error');
        cerrarModal();
        toast('Promoción eliminada');
        cargarPromociones();
    });
};

// ══════════════════════════════════════════
// PROYECTOS
// ══════════════════════════════════════════
const cargarProyectos = async () => {
    const lista = document.getElementById('proyectos-list');
    lista.innerHTML = '<div class="loading">Cargando...</div>';
    const data = await fetchAPI('/proyectos');
    if (!data) return;

    if (data.length === 0) {
        lista.innerHTML = '<div class="loading">No hay proyectos registrados.</div>';
        return;
    }

    lista.innerHTML = data.map(p => `
        <div class="data-card">
            <div class="data-card-info">
                <span class="data-card-name">${p.nombre}</span>
                <span class="data-card-sub">${p.promocion?.nombre || 'Sin promoción'} · ${p.notas?.length || 0} notas</span>
            </div>
            <div class="data-card-actions">
                <button class="btn-secondary" onclick="gestionarNotas('${p._id}', '${p.nombre}', '${p.promocion?._id || ''}')">Notas</button>
                ${esAdmin() ? `
                <button class="btn-edit" onclick="editarProyecto('${p._id}', '${p.nombre}', '${p.promocion?._id || ''}')">Editar</button>
                <button class="btn-delete" onclick="eliminarProyecto('${p._id}', '${p.nombre}')">Eliminar</button>
                ` : ''}
            </div>
        </div>
    `).join('');
};

document.getElementById('btn-nuevo-proyecto').addEventListener('click', async () => {
    if (!esAdmin() && getRol() !== 'profesor') return toast('Sin permisos para crear proyectos', 'error');
    const promociones = await fetchAPI('/promociones');
    const opcionesPromocion = promociones?.map(p => `<option value="${p._id}">${p.nombre}</option>`).join('') || '';

    abrirModal('Nuevo proyecto', `
        <div class="field">
            <label>Nombre</label>
            <input type="text" id="f-nombre" placeholder="Proyecto E-commerce" required>
        </div>
        <div class="field">
            <label>Promoción</label>
            <select id="f-promocion" required>
                <option value="">Selecciona una promoción</option>
                ${opcionesPromocion}
            </select>
        </div>
    `, async () => {
        const body = {
            nombre: document.getElementById('f-nombre').value,
            promocion: document.getElementById('f-promocion').value
        };
        const res = await fetchAPI('/proyectos', { method: 'POST', body: JSON.stringify(body) });
        if (res?.error) return toast(res.error, 'error');
        cerrarModal();
        toast('Proyecto creado correctamente');
        cargarProyectos();
    });
});

const editarProyecto = async (id, nombre, promocionId) => {
    const promociones = await fetchAPI('/promociones');
    const opcionesPromocion = promociones?.map(p =>
        `<option value="${p._id}" ${p._id === promocionId ? 'selected' : ''}>${p.nombre}</option>`
    ).join('') || '';

    abrirModal('Editar proyecto', `
        <div class="field">
            <label>Nombre</label>
            <input type="text" id="f-nombre" value="${nombre}" required>
        </div>
        <div class="field">
            <label>Promoción</label>
            <select id="f-promocion" required>
                ${opcionesPromocion}
            </select>
        </div>
    `, async () => {
        const body = {
            nombre: document.getElementById('f-nombre').value,
            promocion: document.getElementById('f-promocion').value
        };
        const res = await fetchAPI(`/proyectos/${id}`, { method: 'PUT', body: JSON.stringify(body) });
        if (res?.error) return toast(res.error, 'error');
        cerrarModal();
        toast('Proyecto actualizado');
        cargarProyectos();
    });
};

const eliminarProyecto = (id, nombre) => {
    abrirModal('Eliminar proyecto', `
        <p class="confirm-msg">¿Seguro que quieres eliminar <strong>${nombre}</strong>?</p>
    `, async () => {
        const res = await fetchAPI(`/proyectos/${id}`, { method: 'DELETE' });
        if (res?.error) return toast(res.error, 'error');
        cerrarModal();
        toast('Proyecto eliminado');
        cargarProyectos();
    });
};

const gestionarNotas = async (proyectoId, proyectoNombre, promocionId) => {

    // Si el proyecto no tiene promoción, avisamos y salimos
    if (!promocionId) {
        return toast('Este proyecto no tiene promoción asignada, asígnale una antes de añadir notas', 'error');
    }

    const alumnos = await fetchAPI('/alumnos');
    if (!alumnos) return;

    // Fix: comparar como strings para evitar problemas con ObjectId
    const alumnosFiltrados = alumnos.filter(a =>
        a.promocion?._id?.toString() === promocionId.toString()
    );

    if (alumnosFiltrados.length === 0) {
        return toast('No hay alumnos inscritos en la promoción de este proyecto', 'error');
    }

    const opcionesAlumnos = alumnosFiltrados.map(a =>
        `<option value="${a._id}">${a.nombre}</option>`
    ).join('');

    // BLOQUE PARA VER NOTAS (EXISTENTES)
    // Carga el proyecto para ver sus notas actuales
    const proyecto = await fetchAPI(`/proyectos/${proyectoId}`);
    const notasExistentes = proyecto?.notas?.length > 0
        ? `<div class="field">
        <label>Notas registradas</label>
        <table style="width:100%; border-collapse:collapse; margin-bottom:0.5rem">
            ${proyecto.notas.map(n => `
                <tr>
                    <td style="padding:4px 0; font-size:0.8rem;">${n.alumno?.nombre || 'Alumno'}</td>
                    <td style="padding:4px 0; font-size:0.8rem; text-align:center;">${n.nota ?? '—'}</td>
                    <td style="padding:4px 0; font-size:0.8rem; text-align:right; color:${n.estado === 'Apto' ? 'var(--accent)' : n.estado === 'No Apto' ? 'var(--danger)' : 'var(--text-secondary)'}">
                        ${n.estado}
                    </td>
                </tr>
            `).join('')}
        </table>
       </div>
       <hr style="border-color:var(--border); margin-bottom:1rem">`
        : '';

    abrirModal(`Añadir nota — ${proyectoNombre}`, `
        ${notasExistentes}
        <div class="field">
            <label>Alumno</label>
            <select id="f-alumno" required>
                <option value="">Selecciona un alumno</option>
                ${opcionesAlumnos}
            </select>
        </div>
        <div class="field">
            <label>Nota (0 - 10)</label>
            <input type="number" id="f-nota" min="0" max="10" step="0.1" placeholder="7.5" required>
        </div>
        <div class="field">
            <label>Estado</label>
            <input type="text" id="f-estado" readonly style="opacity:0.5; cursor:not-allowed" value="Introduce una nota">
        </div>
    `, async () => {
        const nota = parseFloat(document.getElementById('f-nota').value);
        const estado = nota >= 5 ? 'Apto' : 'No Apto';
        const body = {
            alumno: document.getElementById('f-alumno').value,
            nota,
            estado,
            profesor: null
        };
        const res = await fetchAPI(`/proyectos/${proyectoId}/notas`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        if (res?.error) return toast(res.error, 'error');
        cerrarModal();
        toast(`Nota añadida — ${estado}`);
        cargarProyectos();
    });

    setTimeout(() => {
        const inputNota = document.getElementById('f-nota');
        const inputEstado = document.getElementById('f-estado');
        if (inputNota && inputEstado) {
            inputNota.addEventListener('input', () => {
                const v = parseFloat(inputNota.value);
                if (!isNaN(v)) inputEstado.value = v >= 5 ? '✅ Apto' : '❌ No Apto';
            });
        }
    }, 100);
};

// ══════════════════════════════════════════
// ANALYTICS
// ══════════════════════════════════════════
const cargarAptosPorCampus = async () => {
    const el = document.getElementById('analytics-aptos');
    el.innerHTML = '<div class="loading">Cargando...</div>';
    const data = await fetchAPI('/analytics/aptos-por-campus');
    if (!data) return;
    el.innerHTML = data.length === 0
        ? '<div class="loading">Sin datos</div>'
        : data.map(d => `
            <div class="analytics-row">
                <span>${d.campus}</span>
                <span class="analytics-value">${Math.round(d.porcentajeAptos)}% aptos</span>
            </div>
        `).join('');
};

const cargarAlumnosEnRiesgo = async () => {
    const el = document.getElementById('analytics-riesgo');
    el.innerHTML = '<div class="loading">Cargando...</div>';
    const data = await fetchAPI('/analytics/alumnos-en-riesgo');
    if (!data) return;
    el.innerHTML = data.length === 0
        ? '<div class="loading">Sin alumnos en riesgo</div>'
        : data.map(d => `
            <div class="analytics-row">
                <span>${d.nombre}</span>
                <span class="analytics-value" style="color: var(--danger)">${d.notaMedia?.toFixed(1)}</span>
            </div>
        `).join('');
};

const cargarRankingNoAptos = async () => {
    const el = document.getElementById('analytics-ranking');
    el.innerHTML = '<div class="loading">Cargando...</div>';
    const data = await fetchAPI('/analytics/ranking-no-aptos');
    if (!data) return;
    el.innerHTML = data.length === 0
        ? '<div class="loading">Sin datos</div>'
        : data.map(d => `
            <div class="analytics-row">
                <span>${d.nombre}</span>
                <span class="analytics-value">${d.totalNoAptos} no aptos</span>
            </div>
        `).join('');
};

// ── INICIO ──
if (getToken()) {
    document.getElementById('user-role-badge').textContent = getRol() || 'usuario';
    document.getElementById('user-email-display').textContent = localStorage.getItem('email') || '';
    mostrarDashboard();
    cargarSeccion('alumnos');
} else {
    mostrarLogin();
}