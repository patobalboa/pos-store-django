# Despliegue de Infraestructura de Alta Disponibilidad y Autoescalado para Django en Azure

Este tutorial describe cómo desplegar la aplicación Django **pos-store** en Azure usando una imagen personalizada, un Virtual Machine Scale Set (VMSS) y un Load Balancer público.

---

## 🔧 Requisitos previos

- Grupo de recursos creado (ejemplo: `rg-pos-store`)
- Instancia base Ubuntu 22.04 corriendo correctamente con **pos-store** vía systemd

---

## 🖥 Crear imagen personalizada en Azure

1. **Detener la aplicación en la VM base:**
    ```bash
    sudo systemctl stop pos-store
    ```
2. **Generalizar la VM (si es necesario):**
    ```bash
    sudo waagent -deprovision+user -force
    ```
3. **Capturar imagen:**
    - Ir a **Azure Portal > Máquinas virtuales > [tu VM] > Capturar**
    - Nombre de imagen: `img-pos-store`
    - Seleccionar **Crear como Managed Image**

---

## 🧱 Crear Virtual Machine Scale Set (VMSS)

1. Ir a **Virtual Machine Scale Sets > Crear**
2. Configurar:
    - Nombre: `vmss-pos-store`
    - Imagen: **img-pos-store** (personalizada)
    - Tipo de instancia: **Standard B1s** o superior
    - Zona redundante: **Habilitado**
    - Tamaño inicial: **2 instancias**
3. **Escalado automático:**
    - Métrica: **CPU > 70%** escala hacia arriba
    - **CPU < 30%** escala hacia abajo
4. **Red:**
    - Usar VNet existente o crear nueva
    - Subred pública

---

## 🌐 Crear Azure Load Balancer público

1. Ir a **Azure Load Balancer > Crear**
2. Configurar:
    - Tipo: **Público**
    - Backend pool: asociar al VMSS `vmss-pos-store`
    - Health probe: **TCP puerto 80**
    - Regla de carga: **TCP 80** hacia backend pool
3. **Seguridad:**
    - El NSG asociado debe permitir tráfico entrante en el **puerto 80**

---

## 🚀 Verificar despliegue

1. Obtener la **IP pública** del Load Balancer
2. Acceder vía navegador:  
    `http://<public-ip>`
3. Verificar que la app Django responde correctamente
4. (Opcional) Generar carga para probar el autoescalado

---

¡Listo! Ahora tienes una infraestructura de alta disponibilidad y autoescalado para tu aplicación Django en Azure.