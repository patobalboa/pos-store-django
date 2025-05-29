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
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
```

### 3. Crea y configura `entrypoint.sh`

Crea un archivo llamado `entrypoint.sh` en la raíz del proyecto:

```bash
#!/bin/bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000
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

Accede a la app en [http://localhost:8000](http://localhost:8000).

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
`http://<IP-PUBLICA-EC2>:8000`

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