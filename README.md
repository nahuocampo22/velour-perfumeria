# 🌸 VELOUR Perfumería — Guía de instalación

## ¿Qué incluye este proyecto?

- **Frontend** (`public/`): Tienda web completa con catálogo, carrito y formulario de pedido
- **Backend** (`server.js`): Servidor Node.js que envía emails automáticos al cliente y a vos
- **Emails automáticos**: Confirmación al comprador + notificación a `nahuel21ocampo@gmail.com`

---

## 📦 Requisitos

- [Node.js](https://nodejs.org/) versión 18 o superior
- Una cuenta de Gmail (la tuya: nahuel21ocampo@gmail.com)

---

## 🚀 Instalación paso a paso

### 1. Instalar dependencias

Abrí una terminal en la carpeta del proyecto y ejecutá:

```bash
npm install
```

### 2. Configurar Gmail (App Password)

Para que el servidor pueda enviar emails desde tu Gmail:

**a)** Activá la verificación en 2 pasos en tu cuenta Google:
   - Ir a → [myaccount.google.com/security](https://myaccount.google.com/security)
   - Activar "Verificación en 2 pasos"

**b)** Generá una App Password:
   - Ir a → [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - En "Seleccionar app" elegí "Correo"
   - En "Seleccionar dispositivo" elegí "Otro" → escribí "VELOUR"
   - Copiá la contraseña de 16 caracteres que te da Google (ej: `abcd efgh ijkl mnop`)

### 3. Crear el archivo .env

Copiá el archivo de ejemplo y completalo:

```bash
cp .env.example .env
```

Abrí `.env` y pegá tu App Password:

```
GMAIL_USER=nahuel21ocampo@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
PORT=3000
```

### 4. Arrancar el servidor

```bash
npm start
```

O para desarrollo (se reinicia solo al hacer cambios):

```bash
npm run dev
```

### 5. Abrir la tienda

Abrí tu navegador en: **http://localhost:3000**

---

## 📧 ¿Cómo funcionan los emails?

Cuando un cliente hace un pedido:

1. **El cliente** recibe un email elegante con el detalle de su compra
2. **Vos** recibís un email con todos los datos: nombre, dirección, productos, total y método de pago

---

## 📁 Estructura del proyecto

```
velour-perfumeria/
├── public/
│   ├── index.html      # Frontend principal
│   ├── style.css       # Estilos
│   └── app.js          # Lógica del carrito y formulario
├── server.js           # Backend Node.js + emails
├── package.json
├── .env                # Tus credenciales (NO compartir)
└── .env.example        # Plantilla de credenciales
```

---

## ✏️ Personalizar productos

Para cambiar los perfumes, editá el array `products` en `public/app.js`:

```js
{
  id: 9,                          // ID único
  name: "Mi Nuevo Perfume",       // Nombre
  category: "floral",             // floral | oriental | fresco | madero
  categoryLabel: "Floral",        // Etiqueta visible
  desc: "Descripción del aroma",  // Descripción corta
  prices: {
    "30ml": 9000,
    "50ml": 14000,
    "100ml": 21000
  },
  badge: "Nuevo",                 // null si no querés badge
  color: "#8a4560",               // Color del frasquito SVG
}
```

---

## 🌐 Publicar online (opcional)

Para que la tienda sea accesible desde internet, podés subirla a:

- **Railway** → [railway.app](https://railway.app) (gratis, muy fácil)
- **Render** → [render.com](https://render.com) (gratis)
- **Heroku** → [heroku.com](https://heroku.com)

En esos servicios, configurás las variables de entorno `GMAIL_USER` y `GMAIL_APP_PASSWORD` en el panel de la plataforma.

---

## ❓ Problemas comunes

**"Error de autenticación de Gmail"**  
→ Asegurate de usar la App Password, no tu contraseña normal de Gmail.

**"El email no llega"**  
→ Revisá la carpeta de Spam. La primera vez puede caer ahí.

**"Puerto en uso"**  
→ Cambiá `PORT=3001` en tu `.env`.

---

Hecho con ❤️ para VELOUR Perfumería
