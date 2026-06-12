# AprenTIC Campus API

API REST para la gestion academica de un bootcamp multi-campus. Permite administrar alumnos, profesores, promociones, proyectos y notas, ademas de consultar metricas academicas para seguimiento del rendimiento.

El proyecto esta construido con Node.js, Express, MongoDB y Mongoose, e incluye autenticacion con JWT, control de roles, documentacion Swagger, carga inicial de datos desde CSV, tests automatizados y un pequeno cliente web para probar la API de forma visual.

## Tecnologias utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- CORS
- dotenv
- Swagger
- Jest
- Supertest
- mongodb-memory-server

## Funcionalidades principales

- Registro e inicio de sesion de usuarios.
- Autenticacion mediante token JWT.
- Control de permisos por rol: `admin` y `profesor`.
- CRUD de alumnos.
- CRUD de profesores.
- CRUD de promociones.
- CRUD de proyectos.
- Gestion de notas por proyecto.
- Calculo automatico del estado de una nota: `Apto`, `No Apto` o `Pendiente`.
- Analytics academicos:
  - Porcentaje de aptos por campus.
  - Alumnos en riesgo.
  - Ranking de proyectos con mas no aptos.
- Documentacion interactiva con Swagger.
- Seed de base de datos desde archivo CSV.
- Cliente web basico para demo.

## Estructura del proyecto

```text
aprentic-campus-api/
|-- client/
|   |-- index.html
|   |-- js/
|   |   `-- main.js
|   `-- styles/
|       `-- style.css
|-- data/
|   `-- alumnos.csv
|-- scripts/
|   `-- seed.js
|-- src/
|   |-- app.js
|   |-- server.js
|   |-- config/
|   |   |-- db.js
|   |   `-- env.js
|   |-- controllers/
|   |-- docs/
|   |-- middlewares/
|   |-- models/
|   |-- routes/
|   |-- services/
|   `-- tests/
|-- .env.example
|-- package.json
`-- README.md
```

## Organizacion por capas

### `src/app.js`

Configura la aplicacion Express. Registra middlewares globales, rutas, Swagger y el manejador centralizado de errores.

### `src/server.js`

Es el punto de entrada de la aplicacion. Conecta con MongoDB y arranca el servidor.

### `src/config`

Contiene la configuracion del proyecto:

- `env.js`: carga variables de entorno.
- `db.js`: conecta con MongoDB mediante Mongoose.

### `src/models`

Define los modelos de datos con Mongoose:

- `Usuario.js`: usuarios que pueden iniciar sesion.
- `Profesor.js`: profesores del bootcamp.
- `Alumno.js`: alumnos inscritos en promociones.
- `Promocion.js`: promociones asociadas a un campus.
- `Campus.js`: campus disponibles.
- `Proyecto.js`: proyectos y notas de alumnos.

### `src/routes`

Define los endpoints de la API y aplica los middlewares necesarios.

### `src/controllers`

Recibe las peticiones HTTP, llama al service correspondiente y devuelve la respuesta al cliente.

### `src/services`

Contiene la logica de negocio y las operaciones con base de datos.

### `src/middlewares`

Incluye middlewares de autenticacion, autorizacion por rol y gestion de errores.

### `src/docs`

Contiene la configuracion de Swagger.

### `src/tests`

Incluye tests unitarios e integracion.

## Instalacion

Clona el repositorio e instala dependencias:

```bash
npm install
```

Crea un archivo `.env` a partir de `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/<nombre_bbdd>?retryWrites=true&w=majority
JWT_SECRET=pon_aqui_un_secreto_seguro
```

## Ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

Modo produccion:

```bash
npm start
```

Por defecto, la API se ejecuta en:

```text
http://localhost:3000
```

Ruta de prueba:

```text
GET /
```

Respuesta esperada:

```json
{
  "message": "AprenTIC Campus API funcionando"
}
```

## Documentacion Swagger

La documentacion interactiva esta disponible en:

```text
http://localhost:3000/api-docs
```

Desde Swagger se pueden consultar los endpoints, ver los esquemas de datos y probar peticiones protegidas usando el token JWT.

## Seed de datos

El proyecto incluye un script para cargar datos iniciales desde `data/alumnos.csv`.

Ejecutar seed:

```bash
node scripts/seed.js
```

El seed:

- Limpia las colecciones existentes.
- Crea campus.
- Crea promociones.
- Crea profesores y usuarios asociados.
- Crea un usuario administrador.
- Crea alumnos.
- Crea proyectos con sus notas.

Credenciales creadas por el seed:

```text
Admin:
email: admin@aprentic.com
password: admin123

Profesores:
password: profesor123
```

## Cliente web

El proyecto incluye un cliente web sencillo en la carpeta `client/`.

Archivos principales:

- `client/index.html`: estructura del login, dashboard y secciones.
- `client/js/main.js`: llamadas a la API, gestion del token y operaciones CRUD.
- `client/styles/style.css`: estilos visuales del dashboard.

El cliente consume la API en:

```js
const API_URL = 'http://localhost:3000/api';
```

## Endpoints principales

### Auth

```text
POST /api/auth/register
POST /api/auth/login
```

### Alumnos

```text
GET    /api/alumnos
GET    /api/alumnos/:id
POST   /api/alumnos
PUT    /api/alumnos/:id
DELETE /api/alumnos/:id
```

### Profesores

```text
GET    /api/profesores
GET    /api/profesores/:id
POST   /api/profesores
PUT    /api/profesores/:id
DELETE /api/profesores/:id
```

### Promociones

```text
GET    /api/promociones
GET    /api/promociones/:id
POST   /api/promociones
PUT    /api/promociones/:id
DELETE /api/promociones/:id
```

### Proyectos

```text
GET    /api/proyectos
GET    /api/proyectos/:id
POST   /api/proyectos
PUT    /api/proyectos/:id
DELETE /api/proyectos/:id
POST   /api/proyectos/:id/notas
PUT    /api/proyectos/:id/notas/:notaId
```

### Analytics

```text
GET /api/analytics/aptos-por-campus
GET /api/analytics/alumnos-en-riesgo
GET /api/analytics/ranking-no-aptos
```

## Autenticacion y roles

La API usa JWT para proteger las rutas privadas.

El token debe enviarse en el header:

```text
Authorization: Bearer <token>
```

Roles disponibles:

- `admin`: puede gestionar usuarios, alumnos, profesores, promociones, proyectos y notas.
- `profesor`: puede acceder a datos y gestionar algunas operaciones academicas, como proyectos o notas.

## Tests

Ejecutar tests:

```bash
npm test
```

El proyecto incluye:

- Tests unitarios del service de alumnos.
- Tests unitarios del middleware de roles.
- Tests de integracion para registro y login.

Los tests de integracion usan `mongodb-memory-server`, por lo que no dependen de la base de datos real.

## Decisiones tecnicas destacables

- Se separo el proyecto por capas para mejorar mantenimiento y claridad.
- Se uso Mongoose para definir esquemas y relaciones entre colecciones.
- Se uso `populate` para devolver datos relacionados de forma mas legible.
- Se creo el modelo `Campus` para normalizar datos y facilitar metricas por campus.
- Se usaron agregaciones de MongoDB para calcular analytics academicos.
- Se anadio Swagger para facilitar pruebas y documentacion.
- Se incluyeron tests para validar partes criticas del sistema.

## Posibles mejoras futuras

- Crear CRUD especifico para campus.
- Anadir paginacion y filtros en listados.
- Mejorar la sincronizacion entre profesor y usuario.
- Ampliar tests para proyectos, notas y analytics.
- Anadir subida real de imagenes para la foto del alumno.
