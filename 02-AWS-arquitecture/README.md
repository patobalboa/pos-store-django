# Despliegue HA + Auto Scaling para Django (pos-store) en AWS

Este tutorial guía paso a paso para desplegar una infraestructura de alta disponibilidad y escalabilidad automática para la aplicación Django **pos-store** en AWS, usando una AMI personalizada, Launch Template, Auto Scaling Group y Application Load Balancer.

---

## 📦 Pre-requisitos

- Aplicación **pos-store** configurada y funcionando en Ubuntu 22.04.
- Acceso SSH a la instancia.
- Haber probado la app localmente (`systemctl status pos-store.service`).

---

## 🖥 Crear AMI personalizada

1. **Actualizar y verificar la app:**
    ```bash
    sudo apt update && sudo apt upgrade -y
    sudo systemctl status pos-store.service
    ```
2. **Detener la app antes de crear la imagen:**
    ```bash
    sudo systemctl stop pos-store
    ```
3. **Crear la imagen:**
    - Ir a **Consola EC2 > Instancias**.
    - Seleccionar la instancia y elegir **Acciones > Imagen y plantillas > Crear imagen**.
    - Nombre sugerido: `pos-store-ubuntu22-configured`.
    - Esperar a que la AMI esté disponible.

---

## 📄 Crear Plantilla de Lanzamiento (Launch Template)

1. Ir a **EC2 > Plantillas de lanzamiento > Crear plantilla de lanzamiento**.
2. Configurar:
    - **Nombre:** `lt-pos-store`
    - **AMI:** Seleccionar la AMI creada.
    - **Tipo de instancia:** `t3.micro` (o superior).
    - **Red y subredes:** Seleccionar VPC y subredes (idealmente en distintas zonas de disponibilidad).
    - **Par de claves SSH:** Asociar si se requiere acceso SSH.
    - **Grupo de seguridad:** Permitir tráfico entrante en puerto **80** (HTTP).
3. Guardar la plantilla.

---

## 🔁 Crear Auto Scaling Group (ASG)

1. Ir a **EC2 > Auto Scaling Groups > Crear Auto Scaling Group**.
2. Configurar:
    - **Nombre:** `asg-pos-store`
    - **Plantilla de lanzamiento:** `lt-pos-store`
    - **Zonas de disponibilidad:** Seleccionar al menos 2.
    - **Tamaño del grupo:**
      - Mínimo: 2
      - Deseado: 2
      - Máximo: 4
3. **Política de escalado:**
    - Añadir política basada en CPU:
      - Si CPU > 70%: aumentar instancias.
      - Si CPU < 30%: reducir instancias.
4. Revisar y crear el ASG.

---

## 🌐 Crear y configurar Load Balancer (ALB)

1. Ir a **EC2 > Load Balancers > Crear Load Balancer**.
2. Seleccionar **Application Load Balancer**.
3. Configurar:
    - **Nombre:** `alb-pos-store`
    - **Esquema:** Público
    - **Listeners:** Puerto 80 (HTTP)
    - **Zonas de disponibilidad:** Seleccionar las mismas que el ASG.
4. **Configurar grupo de destino:**
    - Tipo: Instancias
    - Asociar el ASG `asg-pos-store` como backend.
    - **Health check:** HTTP `/` (raíz de Django)
5. **Grupo de seguridad:** Permitir tráfico HTTP (puerto 80).
6. Revisar y crear el ALB.

---

## ✅ Verificación

- Accede a la URL pública del ALB.
- Verifica que la aplicación responde correctamente y que el tráfico se distribuye entre instancias.
- Simula carga para probar el escalado automático.

---

**¡Listo! Tu aplicación Django ahora está desplegada en AWS con alta disponibilidad y autoescalado.**