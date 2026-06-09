const API_URL = 'http://localhost:3000/api';

// ── TOKEN ──
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// ── PANTALLAS ──
const mostrarDashboard = () => {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');
};

const mostrarLogin = () => {
    document.getElementById('dashboard-screen').classList.remove('active');
    document.getElementById('login-screen').classList.add('active');
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
            errorEl.classList.remove('hidden');
            return;
        }

        setToken(data.token);
        document.getElementById('user-email-display').textContent = email;
        document.getElementById('user-role-badge').textContent = data.rol || 'usuario';
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
document.getElementById('logout-btn').addEventListener('click', () => {
    removeToken();
    mostrarLogin();
});

// ── CARGA DE SECCIONES ──
const cargarSeccion = (seccion) => {
    if (seccion === 'alumnos') cargarAlumnos();
    if (seccion === 'profesores') cargarProfesores();
    if (seccion === 'promociones') cargarPromociones();
    if (seccion === 'proyectos') cargarProyectos();
};

const fetchAPI = async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (res.status === 401) { mostrarLogin(); return null; }
    return res.json();
};

// ── ALUMNOS ──
const cargarAlumnos = async () => {
    const lista = document.getElementById('alumnos-list');
    lista.innerHTML = '<div class="loading">Cargando...</div>';
    const data = await fetchAPI('/alumnos');
    if (!data) return;
    lista.innerHTML = data.map(a => `
        <div class="data-card">
            <div class="data-card-info">
                <span class="data-card-name">${a.nombre}</span>
                <span class="data-card-sub">${a.email} · ${a.promocion?.nombre || 'Sin promoción'}</span>
            </div>
            <div class="data-card-actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Eliminar</button>
            </div>
        </div>
    `).join('');
};

// ── PROFESORES ──
const cargarProfesores = async () => {
    const lista = document.getElementById('profesores-list');
    lista.innerHTML = '<div class="loading">Cargando...</div>';
    const data = await fetchAPI('/profesores');
    if (!data) return;
    lista.innerHTML = data.map(p => `
        <div class="data-card">
            <div class="data-card-info">
                <span class="data-card-name">${p.nombre}</span>
                <span class="data-card-sub">${p.email}</span>
            </div>
            <div class="data-card-actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Eliminar</button>
            </div>
        </div>
    `).join('');
};

// ── PROMOCIONES ──
const cargarPromociones = async () => {
    const lista = document.getElementById('promociones-list');
    lista.innerHTML = '<div class="loading">Cargando...</div>';
    const data = await fetchAPI('/promociones');
    if (!data) return;
    lista.innerHTML = data.map(p => `
        <div class="data-card">
            <div class="data-card-info">
                <span class="data-card-name">${p.nombre}</span>
                <span class="data-card-sub">${p.campus?.nombre || 'Sin campus'}</span>
            </div>
            <div class="data-card-actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Eliminar</button>
            </div>
        </div>
    `).join('');
};

// ── PROYECTOS ──
const cargarProyectos = async () => {
    const lista = document.getElementById('proyectos-list');
    lista.innerHTML = '<div class="loading">Cargando...</div>';
    const data = await fetchAPI('/proyectos');
    if (!data) return;
    lista.innerHTML = data.map(p => `
        <div class="data-card">
            <div class="data-card-info">
                <span class="data-card-name">${p.nombre}</span>
                <span class="data-card-sub">${p.promocion?.nombre || 'Sin promoción'} · ${p.notas?.length || 0} notas</span>
            </div>
            <div class="data-card-actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Eliminar</button>
            </div>
        </div>
    `).join('');
};

// ── ANALYTICS ──
const cargarAptosPorCampus = async () => {
    const el = document.getElementById('analytics-aptos');
    el.innerHTML = '<div class="loading">Cargando...</div>';
    const data = await fetchAPI('/analytics/aptos-por-campus');
    if (!data) return;
    el.innerHTML = data.map(d => `
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
    el.innerHTML = data.map(d => `
        <div class="analytics-row">
            <span>${d.nombre}</span>
            <span class="analytics-value">${d.notaMedia?.toFixed(1)}</span>
        </div>
    `).join('');
};

const cargarRankingNoAptos = async () => {
    const el = document.getElementById('analytics-ranking');
    el.innerHTML = '<div class="loading">Cargando...</div>';
    const data = await fetchAPI('/analytics/ranking-no-aptos');
    if (!data) return;
    el.innerHTML = data.map(d => `
        <div class="analytics-row">
            <span>${d.nombre}</span>
            <span class="analytics-value">${d.totalNoAptos} no aptos</span>
        </div>
    `).join('');
};

// ── INICIO ──
if (getToken()) {
    mostrarDashboard();
    cargarSeccion('alumnos');
} else {
    mostrarLogin();
}