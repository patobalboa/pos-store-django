# Despliegue de la aplicación Django "pos-store" en Ubuntu 22.04

Este tutorial describe paso a paso cómo desplegar la aplicación **pos-store** en un servidor Ubuntu 22.04, incluyendo la configuración de un servicio systemd para ejecución automática.

## Requisitos del sistema

- Ubuntu Server 22.04 o superior
- Acceso a usuario con privilegios `sudo`
- Puerto 80 disponible

## Instalación de dependencias del sistema

Ejecute el siguiente comando para instalar las dependencias necesarias:

```bash
sudo apt-get update && sudo apt-get install -y \
    build-essential \
    libpango1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    libcairo2 \
    weasyprint \
    python3 \
    python3-venv && sudo apt clean
```

## Clonación del repositorio

```bash
git clone https://github.com/wdavilav/pos-store.git
cd pos-store
```

## Crear y activar entorno virtual

```bash
python3 -m venv env
source env/bin/activate
```

## Instalar dependencias Python

```bash
pip install -r deploy/txt/requirements.txt
```

## Ejecutar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

## Cargar datos iniciales

```bash
python manage.py shell --command='from core.init import *'
python manage.py shell --command='from core.utils import *'
```

## Ejecutar la aplicación manualmente

```bash
python manage.py runserver 0.0.0.0:80
```

## Automatizar con servicio systemd

Cree el archivo `/etc/systemd/system/pos-store.service` con el siguiente contenido (ajuste las rutas y el usuario si es necesario):

```ini
[Unit]
Description=pos-store Django App
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/pos-store
Environment="PATH=/home/ubuntu/pos-store/env/bin"
ExecStart=/home/ubuntu/pos-store/env/bin/python /home/ubuntu/pos-store/manage.py runserver 0.0.0.0:80
Restart=always

[Install]
WantedBy=multi-user.target
```

## Habilitar y levantar el servicio

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable pos-store.service
sudo systemctl start pos-store.service
```

## Verificar estado del servicio

```bash
sudo systemctl status pos-store.service
```

---

¡La aplicación **pos-store** debería estar corriendo en el puerto 80 de su servidor Ubuntu!