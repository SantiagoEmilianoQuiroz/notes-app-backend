# Backend - CRUD Notes API

Este directorio contiene la API REST del proyecto CRUD MERN. Su responsabilidad es manejar la lógica de negocio, conectarse a MongoDB Atlas y expone endpoints para crear, listar, actualizar y eliminar notas.

## 1. Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv
- cors

## 2. Objetivo del backend

El backend actúa como capa de acceso a datos y lógica del negocio. Permite que el cliente web pueda:

- obtener todas las notas
- crear una nueva nota
- ver una nota por su ID
- actualizar el contenido de una nota
- eliminar una nota

La API se comunica con MongoDB usando Mongoose y responde en formato JSON.

## 3. Requisitos previos

Antes de levantar el backend, asegúrate de tener instalado en tu sistema:

- Node.js 18 o superior
- npm
- una cuenta y base de datos en MongoDB Atlas

## 4. Instalación

Desde la carpeta `server` ejecuta:

```bash
npm install
```

## 5. Variables de entorno

Crea un archivo `.env` dentro de `server` con esta estructura:

```env
PORT=3000
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@TU_CLUSTER.mongodb.net/notesDB?retryWrites=true&w=majority
```

### Variables explicadas

- `PORT`: puerto donde correrá la API
- `MONGODB_URI`: cadena de conexión a MongoDB Atlas

> Importante: el usuario y la contraseña deben corresponder a un usuario creado en MongoDB Atlas con permisos sobre la base de datos.

## 6. Cómo levantar el backend

En la carpeta `server` ejecuta:

```bash
npm run dev
```

Esto iniciará el servidor con `node --watch`, que reinicia automáticamente cuando detecta cambios en el código.

Si todo está bien, verás un mensaje similar a:

```bash
Server is running on port http://localhost:3000
```

## 7. Arquitectura del backend

La estructura principal es esta:

```text
server/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── noteModels.js
│   ├── routes/
│   │   └── notesRoutes.js
│   └── server.js
├── .env
├── package.json
├── README.md
└── request.http
```

### `src/server.js`

Es el punto de entrada del backend. Aquí se:

- carga la configuración de entorno
- crea la app de Express
- habilita CORS para permitir que el cliente frontend haga peticiones
- activa `express.json()` para leer JSON del cliente
- monta la API en `/api/notes`
- inicia la conexión a MongoDB y arranca el servidor

### `src/config/db.js`

Archivo responsable de la conexión con MongoDB usando `mongoose.connect()`. Si la autenticación falla o no existe la variable de entorno, la app debe mostrar el error y no continuar.

### `src/models/noteModels.js`

Define el esquema de Mongoose para las notas:

```js
{
  title: String,
  description: String,
  createdAt,
  updatedAt
}
```

### `src/routes/notesRoutes.js`

Aquí se definen las rutas de la API REST.

## 8. Endpoints disponibles

La base de todas las rutas es:

```text
/api/notes
```

### 8.1 Obtener todas las notas

```http
GET /api/notes
```

Respuesta esperada:

```json
[
  {
    "_id": "...",
    "title": "Mi nota",
    "description": "Contenido de la nota",
    "createdAt": "2026-08-24T10:00:00.000Z",
    "updatedAt": "2026-08-24T10:00:00.000Z"
  }
]
```

### 8.2 Obtener una nota por ID

```http
GET /api/notes/:id
```

### 8.3 Crear una nota

```http
POST /api/notes
```

Body esperado:

```json
{
  "title": "Titulo de ejemplo",
  "description": "Descripcion de la nota"
}
```

### 8.4 Actualizar una nota

```http
PUT /api/notes/:id
```

Body esperado:

```json
{
  "title": "Nuevo titulo",
  "description": "Nueva descripcion"
}
```

### 8.5 Eliminar una nota

```http
DELETE /api/notes/:id
```

## 9. Funcionalidades importantes implementadas

### CRUD completo

La API soporta las operaciones básicas de un CRUD:

- Create
- Read
- Update
- Delete

### Validación de datos

Se libra del manejo de datos con `mongoose` y se valida que el campo `title` y `description` se reciban correctamente desde el cliente.

### Manejo de errores

Cada endpoint captura errores, imprime el mensaje en consola y responde con un status HTTP apropiado.

### Conexión robusta con MongoDB

Antes de iniciar el servidor, el backend intenta conectarse a MongoDB y, si falla, deja claro el motivo del problema para facilitar debugging.

## 10. Flujo típico de trabajo

1. Se inicia el servidor con `npm run dev`
2. El cliente hace peticiones HTTP a `localhost:3000/api/notes`
3. Express recibe la request
4. El router llama al modelo de Mongoose
5. Mongoose realiza la operación sobre la colección `notes`
6. La API devuelve una respuesta JSON al cliente

## 11. Solución de problemas comunes

### Error: `bad auth : Authentication failed.`

Esto ocurre porque la URI de MongoDB no tiene credenciales válidas. Revisa:

- usuario correcto en Atlas
- contraseña correcta
- IP permitida en Network Access
- base de datos y cluster correctos

### Error: `MONGODB_URI no está definida`

Verifica que exista el archivo `.env` dentro de `server` y que la variable se llame exactamente `MONGODB_URI`.

### Error de CORS

El backend está configurado para aceptar peticiones desde `http://localhost:5173`. Si cambias el puerto o el host del frontend, debes actualizar el origen en `src/server.js`.

## 12. Archivo de pruebas HTTP

En el proyecto hay un archivo `request.http` que puede servir para probar endpoints desde VS Code o herramientas como REST Client.

## 13. Conclusión

El backend de este proyecto es una API REST sencilla pero funcional, orientada a manejar notas de forma persistente con MongoDB. Está diseñado para ser claro, mínimo y fácil de extender a nuevas funcionalidades.

---

Si quieres avanzar en el proyecto, el siguiente paso puede ser agregar:

- autenticación de usuarios
- paginación
- filtros por fecha o texto
- pruebas automatizadas con Jest o Vitest
