/* ============================
   VELOUR — Frontend App
   ============================ */

// ---- PRODUCT DATA ----
const products = [
  {
    id: 1,
    name: "Noir Absolu",
    category: "oriental",
    categoryLabel: "Oriental",
    desc: "Oud, cedro y almizcle. Una fragancia oscura y seductora para la noche.",
    prices: { "30ml": 12500, "50ml": 18900, "100ml": 28500 },
    badge: "Más vendido",
    color: "#2d1f1a",
  },
  {
    id: 2,
    name: "Rose Éternelle",
    category: "floral",
    categoryLabel: "Floral",
    desc: "Rosa búlgara, peonía y sándalo blanco. Elegancia atemporal.",
    prices: { "30ml": 11000, "50ml": 16500, "100ml": 24000 },
    badge: null,
    color: "#8a4560",
  },
  {
    id: 3,
    name: "Aqua Libera",
    category: "fresco",
    categoryLabel: "Fresco",
    desc: "Bergamota, menta marina y vetiver. Libertad en cada spray.",
    prices: { "30ml": 9800, "50ml": 14500, "100ml": 21000 },
    badge: "Nuevo",
    color: "#1a4a6b",
  },
  {
    id: 4,
    name: "Bois Sacré",
    category: "madero",
    categoryLabel: "Madero",
    desc: "Sándalo, pachulí y vainilla ahumada. Profundo y envolvente.",
    prices: { "30ml": 13500, "50ml": 20000, "100ml": 30000 },
    badge: null,
    color: "#4a3020",
  },
  {
    id: 5,
    name: "Blanche Lumière",
    category: "floral",
    categoryLabel: "Floral",
    desc: "Jazmín, muguet y musgo blanco. Pureza hecha perfume.",
    prices: { "30ml": 10500, "50ml": 15800, "100ml": 23500 },
    badge: null,
    color: "#6a5a7a",
  },
  {
    id: 6,
    name: "Cèdre Nomade",
    category: "madero",
    categoryLabel: "Madero",
    desc: "Cedro del Atlas, cuero suave y ámbar. Para el viajero eterno.",
    prices: { "30ml": 14000, "50ml": 21000, "100ml": 32000 },
    badge: "Exclusivo",
    color: "#5a3a20",
  },
  {
    id: 7,
    name: "Soleil d'Été",
    category: "fresco",
    categoryLabel: "Fresco",
    desc: "Limón siciliano, neroli y coco. El verano en un frasco.",
    prices: { "30ml": 9500, "50ml": 14000, "100ml": 20500 },
    badge: null,
    color: "#8a7020",
  },
  {
    id: 8,
    name: "Oud Mystique",
    category: "oriental",
    categoryLabel: "Oriental",
    desc: "Oud puro, rosa turca y resinas orientales. Majestuoso.",
    prices: { "30ml": 16000, "50ml": 24000, "100ml": 36000 },
    badge: "Premium",
    color: "#3a1a30",
  },
];

// ---- STATE ----
let cart = [];
let selectedSizes = {};
let activeFilter = "all";

// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupFilters();
  setupForm();
  updateCartUI();
});

// ---- BOTTLE SVG generator (color-aware) ----
function bottleSVG(color) {
  return `<svg viewBox="0 0 120 220" xmlns="http://www.w3.org/2000/svg" fill="none">
    <rect x="48" y="8" width="24" height="18" rx="3" fill="${color}" opacity="0.9"/>
    <rect x="52" y="3" width="16" height="8" rx="2" fill="${color}cc"/>
    <path d="M32 50 Q22 72 20 112 Q18 162 20 186 Q22 210 60 212 Q98 210 100 186 Q102 162 100 112 Q98 72 88 50 Z" fill="${color}22"/>
    <path d="M32 50 Q22 72 20 112 Q18 162 20 186 Q22 210 60 212 Q98 210 100 186 Q102 162 100 112 Q98 72 88 50 Z" fill="url(#g${color.replace('#','')})" opacity="0.85"/>
    <path d="M36 82 Q29 102 27 132 Q25 162 27 180" stroke="white" stroke-width="2" opacity="0.3" fill="none" stroke-linecap="round"/>
    <ellipse cx="60" cy="50" rx="28" ry="7" fill="${color}" opacity="0.6"/>
    <defs>
      <linearGradient id="g${color.replace('#','')}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.9"/>
        <stop offset="45%" stop-color="white" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0.7"/>
      </linearGradient>
    </defs>
  </svg>`;
}

// ---- RENDER PRODUCTS ----
function renderProducts(filter = "all") {
  const grid = document.getElementById("productsGrid");
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(product => {
    const sizes = Object.keys(product.prices);
    const selectedSize = selectedSizes[product.id] || sizes[0];
    const price = product.prices[selectedSize];

    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          ${bottleSVG(product.color)}
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        </div>
        <div class="product-info">
          <p class="product-category">${product.categoryLabel}</p>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <div class="product-sizes">
            ${sizes.map(s => `
              <button class="size-btn ${s === selectedSize ? "active" : ""}"
                onclick="selectSize(${product.id}, '${s}'); event.stopPropagation()">
                ${s}
              </button>
            `).join("")}
          </div>
          <div class="product-footer">
            <span class="product-price">$${price.toLocaleString("es-AR")}</span>
            <button class="btn-outline" onclick="addToCart(${product.id}); event.stopPropagation()">
              + Agregar
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// ---- FILTER ----
function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      renderProducts(activeFilter);
    });
  });
}

// ---- SIZE SELECTION ----
function selectSize(productId, size) {
  selectedSizes[productId] = size;
  renderProducts(activeFilter);
}

// ---- CART ----
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const size = selectedSizes[productId] || Object.keys(product.prices)[0];
  const price = product.prices[size];

  const existingIdx = cart.findIndex(i => i.id === productId && i.size === size);
  if (existingIdx >= 0) {
    cart[existingIdx].qty += 1;
  } else {
    cart.push({ id: productId, name: product.name, size, price, qty: 1 });
  }

  updateCartUI();
  showCartDrawer();
  showAddedFeedback(productId);
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  // Header count
  document.getElementById("cartCount").textContent = count;

  // Cart drawer
  const drawerItems = document.getElementById("cartDrawerItems");
  const drawerFooter = document.getElementById("cartDrawerFooter");

  if (cart.length === 0) {
    drawerItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
    drawerFooter.style.display = "none";
  } else {
    drawerItems.innerHTML = cart.map((item, idx) => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-detail">${item.size} · Cant: ${item.qty}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="cart-item-price">$${(item.price * item.qty).toLocaleString("es-AR")}</span>
          <button class="cart-item-remove" onclick="removeFromCart(${idx})">✕</button>
        </div>
      </div>
    `).join("");
    document.getElementById("drawerTotal").textContent = "$" + total.toLocaleString("es-AR");
    drawerFooter.style.display = "block";
  }

  // Order section summary
  const cartSummary = document.getElementById("cartSummary");
  const cartTotal = document.getElementById("cartTotal");
  const totalAmount = document.getElementById("totalAmount");

  if (cart.length === 0) {
    cartSummary.innerHTML = '<p class="empty-cart">Tu carrito está vacío.<br/><a href="#catalogo">Explorar productos →</a></p>';
    cartTotal.style.display = "none";
  } else {
    cartSummary.innerHTML = cart.map((item, idx) => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-detail">${item.size} · Cant: ${item.qty}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="cart-item-price">$${(item.price * item.qty).toLocaleString("es-AR")}</span>
          <button class="cart-item-remove" onclick="removeFromCart(${idx})">✕</button>
        </div>
      </div>
    `).join("");
    totalAmount.textContent = "$" + total.toLocaleString("es-AR");
    cartTotal.style.display = "flex";
  }
}

function showAddedFeedback(productId) {
  // Visual flash on the card
  const cards = document.querySelectorAll(`.product-card[data-id="${productId}"]`);
  cards.forEach(card => {
    card.style.outline = "2px solid #b8845a";
    setTimeout(() => card.style.outline = "none", 600);
  });
}

// ---- CART DRAWER TOGGLE ----
function toggleCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  drawer.classList.toggle("open");
  overlay.classList.toggle("open");
}

function showCartDrawer() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}

// ---- ORDER FORM ----
function setupForm() {
  document.getElementById("orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Tu carrito está vacío. Agregá productos antes de confirmar.");
      return;
    }

    const submitBtn = document.getElementById("submitBtn");
    const submitText = document.getElementById("submitText");
    const submitLoader = document.getElementById("submitLoader");

    submitBtn.disabled = true;
    submitText.style.display = "none";
    submitLoader.style.display = "inline";

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const orderData = {
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      email: document.getElementById("email").value,
      telefono: document.getElementById("telefono").value,
      direccion: document.getElementById("direccion").value,
      notas: document.getElementById("notas").value,
      pago: document.getElementById("pago").value,
      items: cart,
      total,
      fecha: new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        document.getElementById("orderForm").style.display = "none";
        document.getElementById("formSuccess").style.display = "block";
        cart = [];
        updateCartUI();
      } else {
        throw new Error(data.error || "Error al enviar el pedido");
      }
    } catch (err) {
      alert("Hubo un error al enviar el pedido: " + err.message + "\n\nAsegurate de que el servidor esté corriendo.");
    } finally {
      submitBtn.disabled = false;
      submitText.style.display = "inline";
      submitLoader.style.display = "none";
    }
  });
}

function resetForm() {
  document.getElementById("orderForm").reset();
  document.getElementById("orderForm").style.display = "flex";
  document.getElementById("formSuccess").style.display = "none";
}
