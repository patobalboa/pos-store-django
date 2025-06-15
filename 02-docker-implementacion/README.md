# 🐳 Despliegue de una Aplicación Django con Docker y EC2 (Guía Educativa)

## 📝 Introducción

Este README está diseñado para estudiantes de Cloud Computing. Aprenderás a contenerizar una aplicación Django usando Docker, ejecutarla localmente con SQLite y desplegarla en una instancia EC2 (Ubuntu 22.04). El objetivo es fortalecer tus habilidades prácticas en DevOps y despliegue de aplicaciones en la nube.

---

## 🖥️ Requisitos del sistema

- Ubuntu Server 22.04 o superior
- Acceso a usuario con privilegios `sudo`
- Puerto 80 disponible
- Docker instalado (localmente o en la instancia EC2)

---

## ⚙️ Instalación de Docker en Ubuntu 22.04

### 1. Agrega el repositorio oficial de Docker

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

### 2. Instala Docker y Docker Compose

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

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
FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
        build-essential \
        libpango1.0-0 \
        libgdk-pixbuf2.0-0 \
        libffi-dev \
        libcairo2 \
        && apt-get clean

WORKDIR /app

COPY deploy/txt/requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]
```

### 3. Crea y configura `entrypoint.sh`

Crea un archivo llamado `entrypoint.sh` en la raíz del proyecto:

```bash
#!/bin/bash

# Migraciones
echo "📦 Ejecutando makemigrations y migrate"
python manage.py makemigrations
python manage.py migrate 

# Carga de datos iniciales
echo "📥 Cargando datos iniciales"
python manage.py shell --command='from core.init import *'
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
docker run -it --rm -p 80:8080 pos-store:latest
```

Accede a la app en [http://localhost:80](http://localhost:80).

> **Nota:** Si tienes problemas con el puerto, asegúrate de que no esté en uso por otro servicio.  
> **Nota:** Si ves un error de permisos, asegúrate de que tu usuario tenga acceso a Docker.  
> **Nota:** Si estás en un servidor remoto asegúrate de acceder a la IP pública del servidor y el puerto 80.

---

## ☁️ Despliegue Automático con Docker Compose en AWS EC2

### 1. Instala Docker en tu instancia EC2

Conéctate por SSH y ejecuta los pasos de instalación de Docker descritos arriba.

### 2. Instala Docker Compose

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 3. Crea el archivo `docker-compose.yml`

En la raíz del proyecto, crea un archivo `docker-compose.yml` con el siguiente contenido:

```yaml
version: '3.8'

services:
    web:
        image: pos-store:latest
        ports:
            - "80:8080"
        restart: always
```

### 4. Ejecuta Docker Compose

```bash
docker-compose up -d
```

### 5. Accede a la app

Abre tu navegador y accede a la aplicación Django en la IP pública de tu instancia EC2:  
`http://<IP-PUBLICA-EC2>`

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
