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
    - Ir a **Azure Portal > Máquinas virtuales > [tu VM] > Capturar > Crear imagen**
    - Nombre de imagen: `img-pos-store`
    - Grupo de recursos: `rg-pos-store`
    - Compartir una imagen: **No**
4. **Esperar a que la imagen se cree** (puede tardar unos minutos)
---

## 🧱 Crear Virtual Machine Scale Set (VMSS) y Load Balancer

Para crear un VMSS que despliegue múltiples instancias de la aplicación Django con autoescalado y en alta disponibilidad, sigue estos pasos:

1. Ir a **Azure Portal > Maquinas virtuales > Conjuntos de escalado de máquinas virtuales (VMSS) > Crear**
**Virtual Machine Scale Sets > Crear**
2. Configurar:
    - Nombre: `vmss-pos-store`
    - Región: `eastus` (o la que prefieras)
    - Grupo de recursos: `rg-pos-store` (o el que hayas creado)
    - Zonas de disponibilidad: **2** (para alta disponibilidad, en mi caso `2` y `3`)
    - Modo de orquestación: **Uniforme**
    - Modo de escalado: **Manual**
    - Número de instancias: **2** (puedes ajustar según tus necesidades)

    - Imagen: **img-pos-store** (personalizada)
    - Tamaño: **Standard B2ms** (1 vCPU, 2GB RAM)
    - Autenticación: **Clave SSH**
        - Clave pública: (tu clave SSH)
        - Nombre de usuario: `azureuser` (O el usuario que usaste en la VM base con la automatización de systemd)

3. Redes:
    - Red virtual: **Crear nueva** (o usar una existente)
    - Subred: **Crear nueva** (o usar una existente)
    - Opciones de equilibrio de carga:
    - Crear un nuevo Load Balancer (Se va a abrir una ventana interactiva para configurar el Load Balancer)
        - Nombre: `lb-pos-store`
        - Tipo: **Público**
        - Protocolo: **TCP**
        - Reglas:
            - Regla de equilibrador de carga: `check`
            - Regla NAT de entrada: `check`
        - Regla de equilibrio de carga:
            - Nombre: `http`
            - Puerto de entrada: `80`
            - Puerto de backend: `80`
        - Regla NAT de entrada:
            - Inicio de intervalo de puertos de frontend: `50000`
            - Puerto de backend: `22`
4. Revisión y creación:
    - Revisar la configuración y hacer clic en **Crear**


---

## 🚀 Verificar despliegue

1. Obtener la **IP pública** del Load Balancer
2. Acceder vía navegador:  
    `http://<public-ip>`
3. Verificar que la app Django responde correctamente
4. (Opcional) Generar carga para probar el autoescalado

---

¡Listo! Ahora tienes una infraestructura de alta disponibilidad y autoescalado para tu aplicación Django en Azure.