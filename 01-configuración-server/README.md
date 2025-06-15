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

### Permisos para ejecutar en el puerto 80

Para permitir que manage.py se ejecute por el puerto 80, es necesario permitir que tu usuario tenga acceso a manejar puertos menores a 1024.

Para ello, puedes usar `setcap` para otorgar permisos al ejecutable de Python:

```bash
sudo setcap 'cap_net_bind_service=+ep' /usr/bin/python3.10
```

### Crear el servicio systemd

Cree el archivo `/etc/systemd/system/pos-store.service` con el siguiente comando: **(ASEGURATE DE QUE EL USUARIO Y LAS RUTAS COINCIDAN CON TU CONFIGURACIÓN)**

> Si no sabes que usuario usar, puedes verificarlo con el comando `whoami`. Para saber la ruta de tu Proyecto, puedes usar `pwd` dentro del directorio del proyecto.

```bash
APP_USER="ubuntu" # Cambia esto al usuario que ejecutará la aplicación
APP_DIR="/home/$APP_USER/pos-store" # Cambia esto, si usaste una ruta diferente al clonar el repositorio

sudo bash -c "cat > /etc/systemd/system/pos-store.service <<EOF
[Unit]
Description=pos-store Django App
After=network.target

[Service]
User=$APP_USER
WorkingDirectory=$APP_DIR
Environment=PATH=$APP_DIR/env/bin
ExecStart=$APP_DIR/env/bin/python $APP_DIR/manage.py runserver 0.0.0.0:80
Restart=always

[Install]
WantedBy=multi-user.target
EOF"


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