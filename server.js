
const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ---- MIDDLEWARE ----
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---- EMAIL TRANSPORTER ----
// Usa Gmail SMTP con App Password (ver README para configurar)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ---- HELPER: formatear items ----
function formatItemsHTML(items) {
  return items.map(item => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #ede6da;font-family:'Georgia',serif;font-size:15px;color:#1e1a17">
        ${item.name}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #ede6da;color:#7a6e66;font-size:14px">
        ${item.size} × ${item.qty}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #ede6da;text-align:right;font-family:'Georgia',serif;font-size:16px;color:#1e1a17;font-weight:600">
        $${(item.price * item.qty).toLocaleString("es-AR")}
      </td>
    </tr>
  `).join("");
}

// ---- EMAIL: confirmación al CLIENTE ----
function buildClientEmail(order) {
  return {
    from: `"VELOUR Perfumería" <${process.env.GMAIL_USER}>`,
    to: order.email,
    subject: `✓ Pedido recibido — VELOUR Perfumería`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f7f3ee;font-family:'DM Sans',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ee;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #ddd4c5;max-width:600px;width:100%">
        
        <!-- HEADER -->
        <tr>
          <td style="background:#1e1a17;padding:32px 40px;text-align:center">
            <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;letter-spacing:0.2em;color:#ffffff;font-weight:300">
              VELOUR
            </h1>
            <p style="margin:8px 0 0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b8845a">
              Perfumería
            </p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:40px 40px 20px">
            <h2 style="font-family:Georgia,serif;font-size:22px;font-weight:300;color:#1e1a17;margin:0 0 8px">
              ¡Tu pedido fue recibido!
            </h2>
            <p style="color:#7a6e66;font-size:14px;line-height:1.7;margin:0 0 28px">
              Hola <strong style="color:#1e1a17">${order.nombre}</strong>, 
              gracias por tu compra. Nos pondremos en contacto a la brevedad para coordinar el pago y la entrega.
            </p>

            <!-- ORDER ITEMS -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
              <tr>
                <td colspan="3" style="padding-bottom:12px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b8845a;border-bottom:2px solid #1e1a17;font-weight:600">
                  Detalle del pedido
                </td>
              </tr>
              ${formatItemsHTML(order.items)}
              <tr>
                <td colspan="2" style="padding:16px 0 0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#7a6e66;font-weight:600">
                  Total
                </td>
                <td style="padding:16px 0 0;text-align:right;font-family:Georgia,serif;font-size:22px;color:#1e1a17;font-weight:600">
                  $${order.total.toLocaleString("es-AR")}
                </td>
              </tr>
            </table>

            <!-- DELIVERY INFO -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ee;border:1px solid #ddd4c5;margin-bottom:28px">
              <tr>
                <td style="padding:20px 24px">
                  <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b8845a;font-weight:600">
                    Datos de entrega
                  </p>
                  <p style="margin:0;font-size:14px;color:#3a3430;line-height:1.7">
                    <strong>${order.nombre} ${order.apellido}</strong><br/>
                    ${order.direccion}<br/>
                    ${order.telefono ? `Tel: ${order.telefono}<br/>` : ""}
                    Pago: ${order.pago}
                    ${order.notas ? `<br/><em style="color:#7a6e66">Nota: ${order.notas}</em>` : ""}
                  </p>
                </td>
              </tr>
            </table>

            <p style="color:#7a6e66;font-size:13px;line-height:1.7;margin:0">
              Si tenés alguna pregunta, respondé este email o escribinos a 
              <a href="mailto:nahuel21ocampo@gmail.com" style="color:#b8845a">nahuel21ocampo@gmail.com</a>.
            </p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #ddd4c5;text-align:center">
            <p style="margin:0;font-size:12px;color:#b0a89e">
              © 2025 VELOUR Perfumería · Buenos Aires, Argentina
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  };
}

// ---- EMAIL: notificación al DUEÑO ----
function buildOwnerEmail(order) {
  const pagoLabel = {
    transferencia: "Transferencia bancaria",
    mercadopago: "MercadoPago",
    efectivo: "Efectivo al recibir",
  }[order.pago] || order.pago;

  return {
    from: `"VELOUR — Nueva venta" <${process.env.GMAIL_USER}>`,
    to: "nahuel21ocampo@gmail.com",
    subject: `🛍️ Nuevo pedido de ${order.nombre} ${order.apellido} — $${order.total.toLocaleString("es-AR")}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0ece7;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 20px">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #ddd4c5;max-width:580px;width:100%">
        
        <tr>
          <td style="background:#b8845a;padding:20px 32px">
            <h2 style="margin:0;font-family:Georgia,serif;color:white;font-weight:300;font-size:20px">
              🛍️ Nuevo pedido recibido
            </h2>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px">${order.fecha}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 32px">

            <!-- Cliente -->
            <h3 style="font-family:Georgia,serif;font-size:16px;font-weight:400;color:#1e1a17;margin:0 0 12px;border-bottom:1px solid #ede6da;padding-bottom:8px">
              👤 Cliente
            </h3>
            <p style="margin:0 0 16px;font-size:14px;color:#3a3430;line-height:1.8">
              <strong>${order.nombre} ${order.apellido}</strong><br/>
              📧 <a href="mailto:${order.email}" style="color:#b8845a">${order.email}</a><br/>
              ${order.telefono ? `📱 ${order.telefono}<br/>` : ""}
              📍 ${order.direccion}<br/>
              💳 ${pagoLabel}
              ${order.notas ? `<br/>📝 <em style="color:#7a6e66">${order.notas}</em>` : ""}
            </p>

            <!-- Productos -->
            <h3 style="font-family:Georgia,serif;font-size:16px;font-weight:400;color:#1e1a17;margin:0 0 12px;border-bottom:1px solid #ede6da;padding-bottom:8px">
              🧴 Productos
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">
              ${formatItemsHTML(order.items)}
              <tr>
                <td colspan="2" style="padding:14px 0 0;font-size:13px;color:#7a6e66;font-weight:600;text-transform:uppercase;letter-spacing:0.08em">
                  TOTAL A COBRAR
                </td>
                <td style="padding:14px 0 0;text-align:right;font-family:Georgia,serif;font-size:24px;color:#1e1a17;font-weight:700">
                  $${order.total.toLocaleString("es-AR")}
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <tr>
          <td style="background:#f7f3ee;padding:16px 32px;border-top:1px solid #ddd4c5">
            <p style="margin:0;font-size:12px;color:#b0a89e;text-align:center">
              VELOUR Perfumería · nahuel21ocampo@gmail.com
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  };
}

// ---- ROUTE: POST /api/order ----
app.post("/api/order", async (req, res) => {
  try {
    const order = req.body;

    // Validaciones básicas
    if (!order.nombre || !order.email || !order.direccion || !order.items?.length) {
      return res.status(400).json({ success: false, error: "Datos incompletos" });
    }

    // Enviar ambos emails en paralelo
    await Promise.all([
      transporter.sendMail(buildClientEmail(order)),
      transporter.sendMail(buildOwnerEmail(order)),
    ]);

    console.log(`✅ Pedido de ${order.nombre} (${order.email}) — $${order.total}`);
    res.json({ success: true });

  } catch (err) {
    console.error("❌ Error al enviar email:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---- CATCH-ALL (SPA) ----
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---- START ----
app.listen(PORT, () => {
  console.log(`\n🌸 VELOUR Perfumería corriendo en http://localhost:${PORT}\n`);
});
