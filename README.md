# 🛒 pos-store: Guía Central de Despliegue para Django

Bienvenido al repositorio **pos-store**, un proyecto educativo diseñado para explorar y comparar distintos métodos de despliegue de una aplicación Django. Este repositorio es ideal para estudiantes de Cloud Computing o DevOps que buscan comprender desde la instalación manual hasta la infraestructura escalable en la nube.

---
## 🚀 Recomendación de Inicio

Puedes escoger entre dos enfoques para comenzar:
- **Manual en Ubuntu 22.04**: Ideal para entender la base del despliegue y la configuración de un servidor.
- **Docker**: Perfecto si prefieres trabajar con contenerización y despliegue en la nube.

Luego de completar el despliegue, puedes explorar las arquitecturas en AWS y Azure para ver cómo escalar y gestionar la aplicación en la nube.

## 📚 Índice de Módulos

| Carpeta                       | Despliegue                              | Descripción breve                                                                 |
|-------------------------------|-----------------------------------------|-----------------------------------------------------------------------------------|
| [`01-configuración-server/`](01-configuración-server/)    | Manual en Ubuntu 22.04                  | Instalación tradicional con entorno virtual y Automatización con systemd                             |
| [`02-docker-implementacion/`](02-docker-implementacion/)   | Docker (local/EC2/VM)                      | Contenerización de la app, ejecutable localmente o en la nube                     |
| [`03-AWS-arquitecture/`](03-AWS-arquitecture/)        | AWS (AMI, ASG, ALB)                     | Infraestructura escalable en AWS usando imágenes, autoescalado y balanceo de carga|
| [`04-Azure-arquitecture/`](04-Azure-arquitecture/)      | Azure (VMSS, LB)                        | Infraestructura escalable en Azure con conjuntos de escalado y balanceador        |


---

## 🛠️ Requisitos Generales

### Conocimientos Previos
- Fundamentos de Python y Django
- Conceptos básicos de redes y sistemas operativos
- Familiaridad con línea de comandos


---

## 🙌 Créditos

Proyecto basado en el repositorio original: [wdavilav/pos-store](https://github.com/wdavilav/pos-store)

---

¡Explora, aprende y despliega! 🚀