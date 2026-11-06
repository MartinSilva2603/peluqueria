# ✂️ Aura Salon - Sistema Profesional de Gestión, Agenda y Retención (Perú - Soles S/)

Micro-aplicación móvil **100% local**, diseñada especialmente para barberos y peluqueros dueños de su propio salón en Perú. No requiere internet para funcionar ni servidores en la nube.

---

## 🎯 Nuevas Funcionalidades Agregadas

### 1. 📅 Agenda de Citas & Sincronización con Google Calendar
* **Agendamiento Rápido:** Programa turnos con cliente, fecha, hora, servicio y precio en Soles (`S/`).
* **Sincronización Google Calendar en 1 Toque:** Abre la app de Google Calendar en el móvil Android con el evento pre-llenado (nombre del cliente, WhatsApp, servicio y notas).
* **Confirmación por WhatsApp:** Envía confirmación automática de la cita al cliente al momento de agendar.
* **Cobro en 1 Toque:** Botón "Cobrar" en la cita que abre el registro y actualiza las finanzas y el historial al instante.

### 2. 🎂 Radar de Cumpleaños
* Registra la fecha de cumpleaños del cliente.
* Si el cliente cumple años hoy o en los próximos 10 días, el Radar muestra una tarjeta especial destacada.
* Botón directo de **"Felicitar por WhatsApp"** con plantilla que incluye saludo cariñoso y regalo de 20% de descuento durante su mes.

### 3. 📢 Plantillas de Promociones de WhatsApp
* **Días Lentos (Martes y Miércoles):** Mensajes pre-redactados para atraer clientes en los días más tranquilos de la semana.
* **Promo Color & Brillo:** Tinte con sesión de hidratación de regalo.
* **Retoque Express:** Cortes y perfilado de barba.

### 4. 🔔 Alertas y Notificaciones al Móvil
* Soporte para notificaciones nativas en el móvil para avisar citas próximas al administrador.

### 5. 🇵🇪 Localización para Perú
* Moneda por defecto en **Soles (`S/`)**.
* Precios iniciales realistas de barrio: Cortes S/ 25 - 35, Tintes S/ 90, Barba S/ 25, Keratinas S/ 150.
* Detección automática del código de país `+51` para números de 9 dígitos de Perú.

---

## 🚀 Cómo Iniciar la App

1. En la terminal de esta carpeta:
   ```powershell
   npm.cmd run dev
   ```
2. Abre en tu navegador `http://localhost:3000`.
3. Si conectas tu teléfono al mismo Wi-Fi, abre la IP de tu PC que muestra Vite para usarla en tu celular.

---

## 📱 Instalación en Android (100% Offline)
* **Como App Nativa PWA / WebAPK (Recomendada):** En Chrome de Android, presiona los 3 puntos y pulsa **"Instalar aplicación"** o **"Agregar a la pantalla principal"**.
* **Como APK con Android Studio:** 
  ```powershell
  npx.cmd @capacitor/cli add android
  npx.cmd @capacitor/cli sync
  npx.cmd @capacitor/cli open android
  ```
