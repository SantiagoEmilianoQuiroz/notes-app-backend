# Dockerización de la aplicación

Esta guía describe cómo ejecutar el frontend, la API y MongoDB en desarrollo con Docker Compose. Esta configuración usa los servidores de desarrollo de Node/Vite y MongoDB sin autenticación; está pensada para uso local, no como despliegue de producción. El frontend y el backend pueden estar en repositorios distintos, pero para usar el Compose actual deben estar en carpetas hermanas:

```text
crud-mern/
├── client/   # Repositorio del frontend
└── server/   # Repositorio del backend y archivo compose.yaml
```

## 1. Requisitos

- Docker instalado y en ejecución.
- Docker Compose v2, disponible como `docker compose`.
- Los directorios `client/` y `server/` ubicados como en el esquema anterior.

## 2. Qué contiene la configuración

En `server/` se encuentran el `compose.yaml` que coordina los servicios y el `Dockerfile` de la API. En `client/` se encuentran el Dockerfile del frontend y su configuración de exclusión de archivos.

Compose construye dos imágenes:

- **`api`**: usa `server/Dockerfile`, basado en Node.js 22 Alpine. Instala las dependencias con `npm ci` y ejecuta `npm run dev`.
- **`client`**: usa `client/Dockerfile`, también basado en Node.js 22 Alpine. Instala las dependencias y ejecuta Vite escuchando en todas las interfaces del contenedor, en el puerto `5173`.

El servicio **`mongo`** usa la imagen oficial `mongo:8`. Compose espera a que su comprobación de salud indique que está listo antes de iniciar la API.

Los tres servicios se conectan a una red interna de Compose:

- La API se conecta a MongoDB mediante `mongodb://mongo:27017/notes`. Dentro de la red, `mongo` es el nombre DNS del servicio; no se debe usar `localhost` para esta conexión.
- Compose configura `VITE_API_URL` como `http://localhost:3000`. El frontend corre en el navegador del host, por eso llama a la dirección publicada de la API y no al nombre interno `api`.
- La API permite solicitudes CORS desde `http://localhost:5173`, que es la dirección local del frontend.

Los puertos `3000` (API), `5173` (frontend) y `27017` (MongoDB) se publican solo en la interfaz local `127.0.0.1`. MongoDB también usa el volumen persistente `mongo_data`, así que los datos sobreviven al cierre y recreación de los contenedores.

Los archivos `.dockerignore` excluyen dependencias locales, artefactos de compilación, archivos de entorno (excepto `server/.env.example`) y metadatos Git del contexto de construcción correspondiente. El `EXPOSE 3000` del Dockerfile de la API documenta el puerto que usa el servidor; Compose es quien lo publica en el host.

## 3. Construir y arrancar la aplicación

Abre una terminal en `server/`:

```bash
cd ruta/a/crud-mern/server
docker compose up --build
```

La opción `--build` construye o actualiza las imágenes antes de arrancar los servicios. La primera ejecución puede tardar mientras Docker descarga las imágenes e instala las dependencias. Mantén la terminal abierta para ver los registros.

Cuando los servicios estén iniciados, abre el frontend en <http://localhost:5173>. La API está disponible en <http://localhost:3000> y MongoDB en el puerto local `27017`.

## 4. Comandos habituales

Ejecuta estos comandos desde `server/`:

```bash
# Iniciar los servicios en segundo plano
docker compose up --build -d

# Consultar estado
docker compose ps

# Seguir los registros de todos los servicios
docker compose logs -f

# Seguir los registros de un servicio
docker compose logs -f api
docker compose logs -f client
docker compose logs -f mongo

# Detener y eliminar los contenedores y la red, conservando los datos de MongoDB
docker compose down
```

Para reconstruir después de modificar el código o dependencias:

```bash
docker compose up --build
```

## 5. Persistencia de MongoDB

Los datos se guardan en el volumen de Docker `mongo_data`. El comando `docker compose down` no elimina ese volumen, por lo que los datos permanecen para el próximo inicio.

Para borrar también la base de datos persistida:

```bash
docker compose down -v
```

**Este comando elimina permanentemente los datos guardados en el volumen de MongoDB.**

## 6. Variables de entorno

Compose proporciona a la API `PORT=3000` y `MONGODB_URI=mongodb://mongo:27017/notes`, y al frontend `VITE_API_URL=http://localhost:3000`. Estas direcciones están pensadas para la configuración local descrita aquí.

El archivo `server/.env.example` es una referencia para ejecutar la API directamente en el host; no es necesario para iniciar los servicios con este Compose. No guardes credenciales o secretos en las imágenes ni en el control de versiones.
