# Despliegue HA + Auto Scaling para Django (pos-store) en AWS

Este tutorial guía paso a paso para desplegar una infraestructura de alta disponibilidad y escalabilidad automática para la aplicación Django **pos-store** en AWS, usando una AMI personalizada, Launch Template, Auto Scaling Group y Application Load Balancer.

---

## 📦 Pre-requisitos

- Aplicación **pos-store** configurada y funcionando en Ubuntu 22.04.
- Acceso SSH a la instancia.
- Haber probado la app localmente (`systemctl status pos-store.service`).

---

## 🖥 Crear AMI personalizada

1. **Crear la imagen:**
    - Ir a **Consola EC2 > Instancias**.
    - Seleccionar la instancia y elegir **Acciones > Imagen y plantillas > Crear imagen**.
    - Nombre sugerido: `pos-store-ubuntu22-configured`.
    - Crear la imagen.
    - Esperar a que la AMI esté disponible (esto puede tardar unos minutos).

> Nota: Puedes ver el progreso en **Consola EC2 > Imágenes > AMIs**.

---

## 📄 Crear Plantilla de Lanzamiento (Launch Template)

1. Ir a **EC2 > Instancias > Plantillas de lanzamiento > Crear plantilla de lanzamiento**.
2. Configurar:
    - **Nombre:** `lt-pos-store`
    - **Orientación sobre Auto Scaling:** Sí
    - **AMI:** Seleccionar la AMI creada. (en Mis AMI)
    - **Tipo de instancia:** `t2.small`.
    - **Clave SSH:** Seleccionar la clave SSH que usarás para acceder a las instancias.
    - **Configuración de red:**
        - **Subred:** No incluir subred (para que el ASG elija automáticamente).
        - **Grupo de seguridad:** Crear uno nuevo o seleccionar uno existente que permita tráfico HTTP (puerto 80).

3. Crear la plantilla de lanzamiento.

---

## 🔁 Crear Auto Scaling Group (ASG)

1. Ir a **EC2 > Auto Scaling Groups > Crear Auto Scaling Group**.
2. Configurar:
    - **Nombre:** `asg-pos-store`
    - **Plantilla de lanzamiento:** `lt-pos-store`
3. **Elegir las opciones de lanzamiento:**
    - **VPC:** Seleccionar la VPC donde se encuentra la plantilla de lanzamiento.
    - **Zonas de disponibilidad:** Seleccionar al menos 2 zonas para alta disponibilidad.
    - **Distribución de zonas de disponibilidad:** Mejor esfuerzo equilibrado.
4. **Integrar en otros servicios:**
    - **Balanceador de carga:** Asociar a un nuevo balanceador de carga.
    - **Tipo de balanceador de carga:** Application Load Balancer (ALB).
    - **Nombre del balanceador de carga:** `alb-pos-store`.
    - **Esquema del balanceador de carga:** Internet-facing.
    - **Zonas de disponibilidad:** Seleccionar las mismas que el ASG (Están seleccionadas automáticamente).
    - **Agentes de escucha y direccionamiento:**
        - **Puerto de escucha:** 80 (HTTP).
        - **Grupo de destino:** Crear uno nuevo con nombre `asg-pos-store`.
    - **Comprobaciones de estado:**
        - **Activar las comprobaciones de estado de Elastic Load Balancing:** `check`.
5. **Configurar escalamiento y tamaño del grupo:**
    - **Tamaño del grupo:** Mínimo 2, deseado 2, máximo 5.
    - **Política de escalamiento:** Basada en CPU (por ejemplo, escalar hacia arriba si la CPU > 70% y hacia abajo si < 30%).
    - **Política de mantenimiento:** Lance antes de terminar.
6. **Revisar y crear el ASG con Balanceador de Carga.**

---

## ✅ Verificación

- Accede a la URL pública del ALB.
- Verifica que la aplicación responde correctamente y que el tráfico se distribuye entre instancias.
- Simula carga para probar el escalado automático.

---

**¡Listo! Tu aplicación Django ahora está desplegada en AWS con alta disponibilidad y autoescalado.**