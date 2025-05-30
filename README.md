# 🐳 Despliegue de una Aplicación Django con Docker y EC2 (Guía Educativa)

## 📝 Introducción

Este README está diseñado para estudiantes de Cloud Computing. Aprenderás a contenerizar una aplicación Django usando Docker, ejecutarla localmente con SQLite y desplegarla en una instancia EC2 (Ubuntu 22.04). El objetivo es fortalecer tus habilidades prácticas en DevOps y despliegue de aplicaciones en la nube.

## 🔗 Reconocimiento

Este proyecto se basa en el repositorio original:  
[https://github.com/wdavilav/pos-store](https://github.com/wdavilav/pos-store)  
¡Gracias a sus autores por compartir la base de este ejercicio!

---

## 🐳 Contenerización Local con Docker

### 1. Clona el proyecto

```bash
git clone https://github.com/wdavilav/pos-store.git
cd pos-store
```

### 2. Crea un `Dockerfile`

Crea un archivo llamado `Dockerfile` en la raíz del proyecto con el siguiente contenido:

```dockerfile
# Dockerfile
FROM python:3.10-slim

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    build-essential \
    libpango1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    libcairo2 \
    && apt-get clean

# Crear directorio de trabajo
WORKDIR /app

# Copiar requerimientos e instalar
COPY deploy/txt/requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiar el resto del proyecto
COPY . .

# Copiar el entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Puerto expuesto
EXPOSE 8080

# EntryPoint y comando por defecto
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]

```

### 3. Crea y configura `entrypoint.sh`

Crea un archivo llamado `entrypoint.sh` en la raíz del proyecto:

```bash
#!/bin/bash
#!/bin/bash

# Migraciones
echo "📦 Ejecutando makemigrations y migrate"
python manage.py makemigrations
python manage.py migrate 

# Carga de datos iniciales
echo "📥 Cargando datos iniciales"
python manage.py shell --command='from core.init import *'
# Cargar datos de ejemplo
echo "📦 Cargando datos de ejemplo"
python manage.py shell --command='from core.utils import *'

# Arrancar servidor
echo "🚀 Iniciando servidor Django"
exec "$@"

```

Hazlo ejecutable:

```bash
chmod +x entrypoint.sh
```

### 4. Construye la imagen Docker

```bash
docker build -t pos-store:latest .
```

### 5. Ejecuta el contenedor con SQLite

```bash
docker run -it --rm -p 8000:8000 pos-store:latest
```

Accede a la app en [http://localhost:8080](http://localhost:8080).
> **Nota:** Si tienes problemas con el puerto, asegúrate de que no esté en uso por otro servicio.
> **Nota:** Si ves un error de permisos, asegúrate de que tu usuario tenga acceso a Docker.
> **Nota:** Si estás en un servidor remoto asegurate de acceder a la IP pública del servidor y el puerto 8080.

---

## ☁️ Despliegue en AWS EC2 (Ubuntu 22.04)

### 1. Instala Docker en EC2

Conéctate por SSH y ejecuta:

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```
*Cierra y vuelve a abrir la sesión SSH para aplicar el grupo.*

### 2. Clona el proyecto en EC2

```bash
git clone https://github.com/wdavilav/pos-store.git
cd pos-store
```

### 3. Construye y ejecuta el contenedor

```bash
docker build -t pos-store:latest .
docker run -d -p 8000:8000 pos-store:latest
```

### 4. Configura el Security Group (SG) en AWS

- Ve a la consola de EC2 > Instancias > [Tu instancia] > Security Groups.
- Edita las reglas de entrada.
- Agrega una regla:
    - Tipo: Custom TCP
    - Puerto: 8000
    - Origen: 0.0.0.0/0 (o restringe según tu necesidad)

### 5. Accede a la app

Abre en tu navegador:  
`http://<IP-PUBLICA-EC2>:8080`

---

## ✅ Resultado Esperado

Deberías ver la aplicación Django ejecutándose y accesible desde tu navegador, tanto localmente como en la nube.

---

## 🧼 Buenas Prácticas

- Usa un archivo `.gitignore` para excluir archivos sensibles:
    ```
    __pycache__/
    *.pyc
    db.sqlite3
    .env
    ```
- **Nunca subas `db.sqlite3` ni archivos de configuración sensibles al repositorio.**
- Utiliza variables de entorno para credenciales y configuraciones.

---

## 🎓 Notas Finales

- Para producción, considera usar **PostgreSQL** en vez de SQLite.
- Puedes extender este despliegue usando `docker-compose` para orquestar múltiples servicios (base de datos, backend, etc.).
- Explora la documentación oficial de Django y Docker para mejores prácticas de seguridad y escalabilidad.

---

¡Feliz aprendizaje y experimentación en la nube! 🚀