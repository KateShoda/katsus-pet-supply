import { UET_TAG_ID } from "./config.js";

const base = new URL(".", import.meta.url);
const url = (path = "") => new URL(path, base).href;
const page = location.pathname.slice(base.pathname.length).replace(/\/|index\.html/g, "") || "home";
const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
const products = [
  { id: "salmon-bites", name: "Salmon Little Bites", category: "Treats", price: 12, color: "#fae5d5", art: "treats", label: "The good-dog favorite", description: "Pretend salmon snacks for very real tail wags. A fictional 6 oz pouch of bite-sized happiness." },
  { id: "everyday-bowl", name: "The Everyday Bowl", category: "Essentials", price: 24, color: "#dce9e0", art: "bowl", label: "Dinner, but make it cute", description: "A fictional ceramic bowl in our signature sage. For imaginary dinner dates and excellent table manners." },
  { id: "sunny-rope", name: "Sunny Rope Toy", category: "Toys", price: 16, color: "#faedb9", art: "rope", label: "For the play-all-day pet", description: "A pretend cotton tug toy in sunshine yellow. Ready for a make-believe game of fetch." },
  { id: "cloud-bed", name: "The Cloud Nap Bed", category: "Essentials", price: 68, color: "#e5e3f1", art: "bed", label: "Professional nap approved", description: "An imaginary extra-cozy, cloud-shaped pet bed. Available in one fictional size: perfectly snoozy." },
  { id: "cat-wand", name: "Daydream Cat Wand", category: "Toys", price: 14, color: "#f5dedf", art: "wand", label: "Tiny tiger energy", description: "A fictional feather wand for imaginary pounces. The perfect addition to a pretend cat's afternoon." },
  { id: "walk-kit", name: "The Happy Walk Kit", category: "Essentials", price: 32, color: "#dce8f0", art: "leash", label: "Let's take the scenic route", description: "A pretend leash and bag holder in ocean blue. All the essentials for a fictional neighborhood adventure." }
];
const paw = '<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="43" rx="16" ry="12"/><ellipse cx="12" cy="28" rx="6" ry="8" transform="rotate(-25 12 28)"/><ellipse cx="26" cy="18" rx="6" ry="8"/><ellipse cx="40" cy="18" rx="6" ry="8"/><ellipse cx="53" cy="28" rx="6" ry="8" transform="rotate(25 53 28)"/></svg>';
const arrow = '<span aria-hidden="true">↗</span>';
let storageWarning = "";
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Katsu's demo could not read ${key}.`, error);
    storageWarning = "Your browser could not restore demo data. You can still browse; enable local storage to complete checkout.";
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Katsu's demo could not save ${key}.`, error);
    notify("Your browser could not save demo data. Enable local storage and try again.");
    return false;
  }
}
const storedCart = read("katsu-cart", []);
let cart = Array.isArray(storedCart) ? storedCart.filter(item => item && products.some(p => p.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99) : [];
let events = read("katsu-events", []);
if (!Array.isArray(events)) events = [];
events = events.filter(event => event && typeof event.name === "string" && typeof event.time === "string").slice(-50);
window.dataLayer = window.dataLayer || [];
window.uetq = window.uetq || [];
if (UET_TAG_ID) {
  if (!/^\d+$/.test(UET_TAG_ID)) {
    storageWarning = "The test UET tag ID is invalid. Update config.js with a numeric tag ID.";
    console.error(storageWarning);
  } else {
    const script = document.createElement("script");
    script.src = "https://bat.bing.com/bat.js";
    script.async = true;
    script.onload = () => {
      if (typeof window.UET !== "function") {
        notify("The UET tracking library could not initialize.");
        return;
      }
      window.uetq = new window.UET({ ti: UET_TAG_ID, q: window.uetq });
      window.uetq.push("pageLoad");
    };
    script.onerror = () => notify("The test UET tag could not load. Check your network or content blocker.");
    document.head.append(script);
  }
}
function track(name, details = {}) {
  const event = { event: name, demo: true, ...details };
  window.dataLayer.push(event);
  window.dispatchEvent(new CustomEvent("katsu:tracking", { detail: event }));
  const { items, ...parameters } = details;
  window.uetq.push("event", name, {
    event_category: "katsu_demo",
    event_label: details.item_id || details.store_id || page,
    ...parameters,
    ...(name === "purchase" ? { revenue_value: details.value, currency: "USD" } : {})
  });
  events = [...events, { name, time: new Date().toISOString(), details }].slice(-50);
  save("katsu-events", events);
}
function art(type) {
  const shapes = {
    treats: '<path d="M85 48h130l8 155H77z" fill="#c76a40"/><path d="M85 48h130v22H85z" fill="#a84f31"/><rect x="96" y="91" width="108" height="80" rx="6" fill="#fff7df"/><text x="150" y="115" text-anchor="middle" font-size="14" font-weight="800" fill="#234d44">KATSU’S</text><path d="M120 139q23-24 48 0-25 24-48 0l-13-11v23z" fill="#cf7246"/><circle cx="159" cy="135" r="2" fill="#234d44"/><text x="150" y="162" text-anchor="middle" font-size="8" fill="#234d44">SALMON LITTLE BITES</text>',
    bowl: '<ellipse cx="150" cy="181" rx="91" ry="13" fill="#234d44" opacity=".1"/><path d="M65 105h170l-16 66q-70 32-138 0z" fill="#5d8771"/><ellipse cx="150" cy="105" rx="85" ry="30" fill="#98b9a0"/><ellipse cx="150" cy="105" rx="66" ry="19" fill="#365e4f"/><path d="M98 142q12 15 28 13" fill="none" stroke="#c8ddc5" stroke-width="5" stroke-linecap="round"/>',
    rope: '<path d="M91 80q91-42 96 37t-78 33q-28-25 8-50" fill="none" stroke="#bf8232" stroke-width="30" stroke-linecap="round"/><path d="M91 80q91-42 96 37t-78 33q-28-25 8-50" fill="none" stroke="#eac35e" stroke-width="20" stroke-dasharray="5 7"/><path d="m88 76-29-26m32 24-7-39m7 38-40-5m65 80-33 40m37-35-6 44m-2-42-42 14" stroke="#d7a642" stroke-width="7" stroke-linecap="round"/>',
    bed: '<ellipse cx="150" cy="184" rx="104" ry="14" fill="#544c71" opacity=".1"/><path d="M52 149q-15-43 25-53-5-41 39-39 34-35 67-3 46-8 50 36 40 14 17 56 0 47-98 47-94 0-100-44" fill="#b2a9cc"/><ellipse cx="151" cy="136" rx="75" ry="35" fill="#d5cde5"/><ellipse cx="151" cy="142" rx="58" ry="23" fill="#c4bad9"/><path d="M91 163q53 22 116-1" stroke="#978aaf" stroke-width="3" fill="none"/>',
    wand: '<path d="m82 202 81-133" stroke="#9a6941" stroke-width="9" stroke-linecap="round"/><path d="M163 69q41-41 49 9t-23 59" fill="none" stroke="#6b6f63" stroke-width="2"/><path d="M187 128q-39 1-30 43 26-7 30-43" fill="#c57782"/><path d="M189 131q32 1 36 39-33-2-36-39" fill="#e6ad57"/><path d="M189 130q-15 25 0 55 22-30 0-55" fill="#769983"/>',
    leash: '<path d="M119 77q-46-38-53 5t52 23q71-32 96 7-1 53-78 56" fill="none" stroke="#447ea0" stroke-width="13" stroke-linecap="round"/><path d="M119 77q-46-38-53 5t52 23q71-32 96 7-1 53-78 56" fill="none" stroke="#9cc3d7" stroke-width="2"/><rect x="113" y="156" width="23" height="32" rx="7" fill="#b1a888"/><rect x="154" y="51" width="46" height="57" rx="16" fill="#447ea0"/><circle cx="176" cy="78" r="9" fill="#b4d2e1"/><path d="M173 52v-9h12v9" fill="none" stroke="#b1a888" stroke-width="4"/>'
  };
  return `<svg viewBox="0 0 300 240" role="img" aria-label="Illustration of ${type}">${shapes[type]}</svg>`;
}
function heroArt() {
  return `<figure class="katsu-photo-frame"><img class="katsu-photo" src="${url("assets/katsu.jpg")}" alt="Katsu, a fluffy black, white, and tan dog, smiling with his tongue out" width="926" height="1000" fetchpriority="high"><figcaption class="photo-caption"><div class="photo-name">Meet Katsu.<span>THE FACE BEHIND THE HAPPY PLACE.</span></div><span class="photo-sticker">Chief treat tester<br><strong>100% good boy</strong></span></figcaption></figure>`;
}
function count() { return cart.reduce((sum, item) => sum + item.quantity, 0); }
function subtotal() { return cart.reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.quantity, 0); }
function shipping(method = "delivery") { return method === "pickup" || subtotal() >= 50 ? 0 : 4.95; }
function itemData() { return cart.map(item => ({ item_id: item.id, item_name: products.find(p => p.id === item.id).name, price: products.find(p => p.id === item.id).price, quantity: item.quantity })); }
function shell(content) {
  document.querySelector("#app").innerHTML = `
    <div class="announcement">A little shop. A lot of love. <span>Free pretend shipping on orders $50+</span></div>
    <header><a class="brand" href="${url()}">${paw}<span>Katsu’s<small>PET SUPPLY</small></span></a>
      <nav aria-label="Main navigation"><a href="${url("#shop")}">Shop all</a><a href="${url("#meet-katsu")}">Meet Katsu</a><a href="${url("store/")}">Our store</a></nav>
      <a class="bag" href="${url("cart/")}" aria-label="Shopping bag, ${count()} items"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 8h14l1 13H4zM8 8V6a4 4 0 0 1 8 0v2"/></svg><span id="bag-count">${count()}</span></a>
    </header>
    <main>${storageWarning ? `<div class="notice" role="alert">${storageWarning}</div>` : ""}${content}</main>
    <footer><div><a class="brand" href="${url()}">${paw}<span>Katsu’s<small>PET SUPPLY</small></span></a><p>For pets. For their people.<br>For happy little everyday adventures.</p></div><div><strong>A pretend shop with a purpose.</strong><p>All products, purchases, and store details are fictional.<br>No payment. No shipment. Just a very good demo.</p><a href="${url("#meet-katsu")}">Meet our chief treat tester ${arrow}</a></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Katsu’s Pet Supply · Demo only</span><span>Made for paws & practice.</span></div></footer>
    <div id="toast" class="toast" role="status" aria-live="polite"></div>
    <dialog id="product-dialog"></dialog>`;
}
function notify(message) {
  const toast = document.querySelector("#toast");
  if (!toast) { console.warn(message); return; }
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove("visible"), 4500);
}
function add(id) {
  const next = cart.map(item => ({ ...item }));
  const existing = next.find(item => item.id === id);
  if (existing?.quantity === 99) { notify("This demo allows up to 99 of each product."); return; }
  if (existing) existing.quantity++; else next.push({ id, quantity: 1 });
  if (!save("katsu-cart", next)) return;
  cart = next;
  const product = products.find(p => p.id === id);
  track("add_to_cart", { item_id: id, currency: "USD", value: product.price, items: [{ item_id: id, price: product.price, quantity: 1 }] });
  document.querySelector("#bag-count").textContent = count();
  document.querySelector(".bag").setAttribute("aria-label", `Shopping bag, ${count()} items`);
  notify(`${product.name} added to your bag.`);
}
function cards(category = "All") {
  return products.filter(p => category === "All" || p.category === category).map(p => `
    <article class="product"><button class="product-art" style="background:${p.color}" data-view="${p.id}" aria-label="View ${p.name}">${art(p.art)}<span class="product-category">${p.category}</span></button>
    <div class="product-info"><div><button class="product-name" data-view="${p.id}">${p.name}</button><p>${p.label}</p></div><strong>${money(p.price)}</strong></div>
    <button class="add-button" data-add="${p.id}">Add to bag <span aria-hidden="true">+</span></button></article>`).join("");
}
function home() {
  shell(`<section class="hero"><div class="hero-copy"><div class="eyebrow"><span></span> GOOD THINGS FOR GOOD PETS</div><h1>Small shop.<br>Big <em>tail wags.</em></h1><p>Everyday favorites for your favorite little friend.<br>Treats, toys, and cozy things—picked with love.</p><div class="hero-actions"><a class="button" href="#shop">Shop the good stuff ${arrow}</a><a class="text-link" href="${url("store/")}">Visit our store ${arrow}</a></div><div class="hero-note">${paw}<span>Pet-approved. People-loved. Entirely pretend.</span></div></div><div class="hero-art">${heroArt()}<div class="art-caption">THE BEST CUSTOMERS HAVE PAWS.</div></div></section>
    <div class="benefits"><span>♡ A little extra love in every order</span><span>✧ Thoughtfully picked favorites</span><span>♧ A neighborhood kind of shop</span></div>
    <section id="shop" class="shop section"><div class="section-heading"><div><div class="eyebrow">THE EVERYDAY GOOD STUFF</div><h2>Meet their new favorites.</h2></div><p>Happy pets start with the little things.</p></div><div class="filters" role="group" aria-label="Product category">${["All", "Treats", "Toys", "Essentials"].map(c => `<button data-filter="${c}" class="${c === "All" ? "active" : ""}" aria-pressed="${c === "All"}">${c === "All" ? "All favorites" : c}</button>`).join("")}</div><div class="product-grid">${cards()}</div><p class="demo-note">A friendly heads-up: these are fictional products. Checkout is a simulation, not a real purchase.</p></section>
    <section class="store-teaser"><div class="mini-store" aria-hidden="true"><div class="awning"></div><div class="store-sign">KATSU’S</div><div class="store-front"><span>${paw}</span><span>OPEN<br><small>FOR PRETEND BUSINESS</small></span></div><div class="store-ground"></div></div><div><div class="eyebrow">YOUR MAKE-BELIEVE NEIGHBORHOOD SHOP</div><h2>Come for the treats.<br>Stay for the tail wags.</h2><p>Say hello to our fictional shop in Pawprint Village.<br>A little local love, with a demo directions button.</p><a class="button" href="${url("store/")}">Visit our store ${arrow}</a></div></section>
    <section id="meet-katsu" class="section katsu-gallery"><div class="section-heading"><div><div class="eyebrow">THE GOOD BOY BEHIND IT ALL</div><h2>A little more Katsu.</h2></div><p>Chief treat tester. Adventure buddy. Expert lounger.</p></div><div class="katsu-gallery-grid">
      <figure><img src="${url("assets/katsu-smile.jpg")}" alt="Katsu sitting indoors with a big smile and his tongue out" width="900" height="1200" loading="lazy"><figcaption><strong>Always ready for a treat.</strong><span>Quality control is a full-time job.</span></figcaption></figure>
      <figure><img src="${url("assets/katsu-adventure.jpg")}" alt="Katsu standing on a stone beside a sunny walking trail and water" width="900" height="1200" loading="lazy"><figcaption><strong>Taking the scenic route.</strong><span>Every good walk deserves a good snack.</span></figcaption></figure>
      <figure><img src="${url("assets/katsu-sunglasses.jpg")}" alt="Katsu resting on the floor wearing black sunglasses" width="900" height="1200" loading="lazy"><figcaption><strong>Off-duty. Still iconic.</strong><span>Even the chief needs a little downtime.</span></figcaption></figure>
    </div></section>`);
}
function summary(method = "delivery") {
  return `<div class="summary-lines"><p><span>Subtotal</span><strong>${money(subtotal())}</strong></p><p><span>${method === "pickup" ? "Pretend pickup" : "Pretend shipping"}</span><strong>${shipping(method) ? money(shipping(method)) : "Free"}</strong></p><p><span>Tax (demo)</span><strong>${money(0)}</strong></p><p class="total"><span>Total</span><strong>${money(subtotal() + shipping(method))}</strong></p></div>`;
}
function empty(title, text) {
  shell(`<section class="empty section"><div class="empty-paw">${paw}</div><h1>${title}</h1><p>${text}</p><a class="button" href="${url("#shop")}">Find a new favorite ${arrow}</a></section>`);
}
function renderCart() {
  if (!cart.length) { empty("An empty bag, for now.", "Your pet's next pretend favorite is waiting."); return; }
  shell(`<section class="section"><div class="eyebrow">GOOD PICKS, GOOD PETS</div><h1>Your shopping bag.</h1><p class="subtitle">A few little things for a very good friend.</p><div class="checkout-layout"><div class="cart-items">${cart.map(item => {
    const p = products.find(p => p.id === item.id);
    return `<article class="cart-item"><div class="cart-art" style="background:${p.color}">${art(p.art)}</div><div><h3>${p.name}</h3><p>${money(p.price)} each · Fictional product</p><label>Quantity <input aria-label="Quantity for ${p.name}" type="number" min="1" max="99" value="${item.quantity}" data-quantity="${p.id}"></label><button class="remove" data-remove="${p.id}">Remove</button></div><strong>${money(p.price * item.quantity)}</strong></article>`;
  }).join("")}</div><aside class="order-summary"><h2>The happy total</h2>${summary()}<a class="button full" href="${url("checkout/")}">Try demo checkout ${arrow}</a><p class="demo-note">No real payment. No personal details.<br>Free pretend shipping at $50.</p></aside></div></section>`);
}
function checkout() {
  if (!cart.length) { empty("Nothing to check out yet.", "Add a fictional product to try the demo purchase flow."); return; }
  shell(`<section class="section"><div class="eyebrow">ONE LAST LITTLE STEP</div><h1>Checkout, minus the payment.</h1><p class="subtitle">This is a simulation. Please do not enter real personal or payment information.</p><div class="checkout-layout"><form id="checkout-form" class="checkout-form"><h2>How would your pet get it?</h2><label class="delivery-choice"><input type="radio" name="fulfillment" value="delivery" checked> <span><strong>Pretend delivery</strong><small>No address needed. Nothing will be shipped.</small></span></label><label class="delivery-choice"><input type="radio" name="fulfillment" value="pickup"> <span><strong>Pretend in-store pickup</strong><small>At our fictional Pawprint Village shop. Always free.</small></span></label><div class="notice">Demo mode is on. All amounts are fictional USD. No card, account, name, or email is required.</div><label class="acknowledge"><input type="checkbox" name="acknowledge" required> I understand this is a fake order and no products will be delivered.</label><button class="button full" type="submit">Place pretend order ${arrow}</button></form><aside class="order-summary"><h2>Your pretend order</h2>${cart.map(item => `<p class="order-product">${products.find(p => p.id === item.id).name} <span>× ${item.quantity}</span></p>`).join("")}<div id="checkout-summary">${summary()}</div><a class="text-link" href="${url("cart/")}">Edit your bag</a></aside></div></section>`);
  track("begin_checkout", { currency: "USD", value: subtotal(), items: itemData() });
  const form = document.querySelector("#checkout-form");
  form.addEventListener("change", () => { document.querySelector("#checkout-summary").innerHTML = summary(form.elements.fulfillment.value); });
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    const method = form.elements.fulfillment.value;
    const order = { id: `DEMO-${crypto.randomUUID()}`, value: subtotal() + shipping(method), subtotal: subtotal(), shipping: shipping(method), currency: "USD", method, items: itemData(), created: new Date().toISOString(), tracked: false };
    if (!save("katsu-order", order)) { button.disabled = false; return; }
    location.assign(url("thank-you/"));
  });
}
function validOrder(order) {
  return order && typeof order.id === "string" && order.id.startsWith("DEMO-") && Number.isFinite(order.value) && order.value > 0 &&
    Array.isArray(order.items) && order.items.length && order.items.every(item => item && products.some(p => p.id === item.item_id) && Number.isInteger(item.quantity) && item.quantity > 0);
}
function confirmation() {
  const order = read("katsu-order", null);
  if (!validOrder(order)) { empty("No pretend order yet.", "Complete demo checkout to see a purchase confirmation."); return; }
  shell(`<section class="confirmation section"><div class="success-icon">✓</div><div class="eyebrow">A VERY GOOD PRETEND PURCHASE</div><h1>Tail wags all around.</h1><p>Your demo order is confirmed. No payment was taken.<br>No products will be shipped or reserved.</p><div class="receipt"><div class="receipt-heading"><strong>Demo order</strong><code>${order.id.slice(0, 18).toUpperCase()}</code></div>${order.items.map(item => `<p><span>${products.find(p => p.id === item.item_id).name} × ${item.quantity}</span><strong>${money(item.price * item.quantity)}</strong></p>`).join("")}<p><span>Pretend ${order.method === "pickup" ? "pickup" : "shipping"}</span><strong>${money(order.shipping)}</strong></p><p class="total"><span>Fictional total</span><strong>${money(order.value)}</strong></p></div><a class="button" href="${url("#shop")}">Keep pretend shopping ${arrow}</a><a class="text-link" href="${url("#meet-katsu")}">Say hello to Katsu ${arrow}</a><p class="demo-note">Thanks for stopping by our little pretend shop.</p></section>`);
  if (!order.tracked) {
    // Persist the deduplication marker before emitting the purchase or clearing the cart.
    if (!save("katsu-order", { ...order, tracked: true })) return;
    track("purchase", { transaction_id: order.id, value: order.value, currency: "USD", shipping: order.shipping, fulfillment: order.method, items: order.items });
  }
  if (save("katsu-cart", [])) {
    cart = [];
    document.querySelector("#bag-count").textContent = "0";
    document.querySelector(".bag").setAttribute("aria-label", "Shopping bag, 0 items");
  }
}
function mapArt() {
  return `<div class="fictional-map" role="img" aria-label="Illustrated fictional map of Pawprint Village; not a real location"><div class="map-park park-one"></div><div class="map-park park-two"></div><div class="map-road road-one"></div><div class="map-road road-two"></div><div class="map-road road-three"></div><span class="map-label label-one">BISCUIT LANE</span><span class="map-label label-two">PAWPRINT VILLAGE</span><div class="map-pin">${paw}<strong>Katsu’s</strong></div><span class="map-disclaimer">ILLUSTRATIVE MAP · NOT A REAL ADDRESS</span></div>`;
}
function store() {
  shell(`<section class="section"><div class="eyebrow">LOCAL LOVE. FICTIONAL LOCATION.</div><h1>Your neighborhood happy place.</h1><p class="subtitle">If we were a real store, this is where the tail wags would happen.</p><div class="store-layout">${mapArt()}<div class="store-details"><span class="pill">Fictional store</span><h2>Katsu’s, Pawprint Village</h2><p>123 Biscuit Lane<br>Pawprint Village, Demo County<br><strong>Not a real address</strong></p><hr><h3>Pretend opening hours</h3><p>Monday–Saturday · 10 am–6 pm<br>Sunday · 11 am–4 pm</p><a class="button full" id="directions-link" href="${url("directions/")}">Get demo directions ${arrow}</a><p class="demo-note">For testing store-intent conversions only.<br>Please don’t travel here. This location does not exist.</p></div></div></section>`);
  track("store_visit", { store_id: "pawprint-village" });
  document.querySelector("#directions-link").addEventListener("click", () => track("get_directions", { store_id: "pawprint-village" }));
}
function directions() {
  shell(`<section class="section directions"><div class="eyebrow">YOU FOUND THE DEMO DESTINATION</div><h1>All roads lead to tail wags.</h1><p class="subtitle">Your demo directions page is open. This is a fictional location, not actual navigation.</p>${mapArt()}<div class="notice"><strong>Do not travel to this address.</strong> Katsu’s Pet Supply and Pawprint Village do not exist. No real maps or navigation service is opened.</div><p>Our make-believe neighborhood is always happy to see you.<br>For a real smile, meet the very real good boy behind the shop.</p><a class="button" href="${url("store/")}">Back to our fictional store ${arrow}</a><a class="text-link" href="${url("#meet-katsu")}">Meet Katsu ${arrow}</a></section>`);
}
({ home, cart: renderCart, checkout, "thank-you": confirmation, store, directions }[page] || home)();
track("page_view", { page_path: location.pathname });
document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) add(addButton.dataset.add);
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    const p = products.find(p => p.id === viewButton.dataset.view);
    const dialog = document.querySelector("#product-dialog");
    dialog.innerHTML = `<button class="dialog-close" aria-label="Close product details">×</button><div class="dialog-art" style="background:${p.color}">${art(p.art)}</div><div class="dialog-copy"><div class="eyebrow">${p.category}</div><h2>${p.name}</h2><p>${p.description}</p><strong class="dialog-price">${money(p.price)}</strong><button class="button full" data-add="${p.id}">Add to bag +</button><p class="demo-note">Fictional product · Demo only</p></div>`;
    dialog.showModal();
    dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
    track("view_item", { item_id: p.id, value: p.price, currency: "USD" });
  }
  const filter = event.target.closest("[data-filter]");
  if (filter) {
    document.querySelectorAll("[data-filter]").forEach(button => { button.classList.toggle("active", button === filter); button.setAttribute("aria-pressed", String(button === filter)); });
    document.querySelector(".product-grid").innerHTML = cards(filter.dataset.filter);
  }
  const remove = event.target.closest("[data-remove]");
  if (remove) {
    const next = cart.filter(item => item.id !== remove.dataset.remove);
    if (save("katsu-cart", next)) { cart = next; renderCart(); notify("Product removed from your bag."); }
  }
});
document.addEventListener("change", event => {
  const input = event.target.closest("[data-quantity]");
  if (!input) return;
  const quantity = Number(input.value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) { input.reportValidity(); input.value = cart.find(item => item.id === input.dataset.quantity).quantity; notify("Choose a whole-number quantity between 1 and 99."); return; }
  const next = cart.map(item => item.id === input.dataset.quantity ? { ...item, quantity } : item);
  if (save("katsu-cart", next)) { cart = next; renderCart(); }
});
