/* ── Data ── */
const BOOKS = [
  { id:1, title:"The Midnight Library",   author:"Matt Haig",            genre:"Fiction",   price:9.99,  stars:5, bg:"#2d1b69" },
  { id:2, title:"Atomic Habits",          author:"James Clear",          genre:"Self-Help", price:12.99, stars:5, bg:"#0f3460" },
  { id:3, title:"Gone Girl",              author:"Gillian Flynn",         genre:"Mystery",   price:8.99,  stars:4, bg:"#1a0a2e" },
  { id:4, title:"Cosmos",                 author:"Carl Sagan",           genre:"Science",   price:11.99, stars:5, bg:"#0a1628" },
  { id:5, title:"The Notebook",           author:"Nicholas Sparks",      genre:"Romance",   price:7.99,  stars:4, bg:"#3b0a2a" },
  { id:6, title:"Sapiens",               author:"Yuval Noah Harari",    genre:"History",   price:13.99, stars:5, bg:"#0a2a1a" },
  { id:7, title:"Project Hail Mary",     author:"Andy Weir",            genre:"Fiction",   price:10.99, stars:5, bg:"#0d1f40" },
  { id:8, title:"Big Magic",             author:"Elizabeth Gilbert",    genre:"Self-Help", price:9.49,  stars:4, bg:"#2a0f3a" },
];

const CATS = [
  { icon:"📖", name:"Fiction",   count:3240 },
  { icon:"🔍", name:"Mystery",   count:1820 },
  { icon:"💕", name:"Romance",   count:2100 },
  { icon:"🔬", name:"Science",   count:890  },
  { icon:"🏛️", name:"History",   count:1340 },
  { icon:"🧘", name:"Self-Help", count:1650 },
  { icon:"🌍", name:"Travel",    count:620  },
  { icon:"🍳", name:"Cooking",   count:740  },
];

const REVS = [
  { name:"Sarah M.",  date:"March 2026",    stars:5, text:"Folio completely changed how I read. The selection is unmatched and the experience is buttery smooth." },
  { name:"David K.",  date:"February 2026", stars:5, text:"Found three incredible novels in one afternoon. The filters are so well designed — genuinely joyful to browse." },
  { name:"Priya N.",  date:"April 2026",    stars:4, text:"Wonderful platform! Eleanor's taste is evident in every recommendation. Love the dark aesthetic too." },
  { name:"Tom R.",    date:"January 2026",  stars:5, text:"Bought four books in a week, zero regrets. Checkout is instant. Exactly what I needed." },
  { name:"Aiko L.",   date:"March 2026",    stars:5, text:"The reviews helped me discover genres I never thought I'd enjoy. Now I am a sci-fi convert." },
  { name:"Marcus B.", date:"April 2026",    stars:4, text:"Great titles at fair prices. Thoughtful, calm design — a welcome contrast to other stores." },
];

/* ── Cart State ── */
let cart = [];

/* ── Render Helpers ── */
function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

function bookCard(b) {
  return `
    <div class="book-card">
      <div class="book-cover" style="background:${b.bg}">
        <div class="book-cover-overlay"></div>
        <div class="book-cover-text">
          <div class="bc-title">${b.title}</div>
          <div class="bc-author">${b.author}</div>
        </div>
      </div>
      <div class="book-foot">
        <div class="book-genre">${b.genre}</div>
        <div class="book-row">
          <div>
            <div class="book-stars">${stars(b.stars)}</div>
            <div class="book-price">$${b.price.toFixed(2)}</div>
          </div>
          <button class="add-btn" onclick="addCart('${b.title}','${b.author}','$${b.price.toFixed(2)}','${b.bg}')">+ Add</button>
        </div>
      </div>
    </div>`;
}

function catCard(c) {
  return `
    <div class="cat-card" onclick="goPage('books')">
      <div class="cat-icon">${c.icon}</div>
      <div class="cat-name">${c.name}</div>
      <div class="cat-count">${c.count.toLocaleString()} books</div>
    </div>`;
}

function revCard(r) {
  return `
    <div class="rev-card">
      <div class="rev-stars">${stars(r.stars)}</div>
      <div class="rev-text">"${r.text}"</div>
      <div class="rev-name">${r.name}</div>
      <div class="rev-date">${r.date}</div>
    </div>`;
}

/* ── Page Rendering ── */
function renderAllBooks() {
  const genre = document.getElementById('fg')?.value || '';
  const list = BOOKS.filter(b => !genre || b.genre === genre);
  document.getElementById('all-books').innerHTML = list.map(bookCard).join('');
}

function init() {
  document.getElementById('hm-books').innerHTML  = BOOKS.slice(0, 4).map(bookCard).join('');
  document.getElementById('hm-cats').innerHTML   = CATS.slice(0, 6).map(catCard).join('');
  document.getElementById('hm-revs').innerHTML   = REVS.slice(0, 3).map(revCard).join('');
  document.getElementById('all-cats').innerHTML  = CATS.map(catCard).join('');
  document.getElementById('all-revs').innerHTML  = REVS.map(revCard).join('');
  renderAllBooks();
  updateCart();
}

/* ── Navigation ── */
function goPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('pg-' + id).classList.add('active');
  document.querySelectorAll('.nav-links button[id^="nb-"]').forEach(b => b.classList.remove('anav'));
  const nb = document.getElementById('nb-' + id);
  if (nb) nb.classList.add('anav');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Cart ── */
function addCart(title, author, price, bg) {
  if (cart.find(c => c.title === title)) { toast('Already in cart!'); return; }
  cart.push({ title, author, price, bg });
  updateCart();
  toast(`"${title}" added to cart`);
}

function updateCart() {
  document.getElementById('cart-count').textContent = cart.length;
  const body = document.getElementById('cart-body');
  const ft   = document.getElementById('cart-ft');

  if (!cart.length) {
    body.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
    ft.style.display = 'none';
    return;
  }

  body.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-cover-sq" style="background:${c.bg}"></div>
      <div>
        <div class="cart-item-t">${c.title}</div>
        <div class="cart-item-a">${c.author}</div>
        <div class="cart-item-p">${c.price}</div>
      </div>
    </div>`).join('');

  const total = cart.reduce((s, c) => s + parseFloat(c.price.replace('$', '')), 0);
  document.getElementById('cart-total').textContent = '$' + total.toFixed(2);
  ft.style.display = 'block';
}

function toggleCart() {
  document.getElementById('cart-panel').classList.toggle('open');
}

function checkout() {
  if (!cart.length) { toast('Your cart is empty!'); return; }
  toast('Redirecting to checkout… 🎉');
  // In production: call your Lambda checkout API here
  // fetch('/api/checkout', { method: 'POST', body: JSON.stringify({ cart }) })
}

/* ── Modal ── */
const loginHTML = `
  <h2>Welcome back</h2>
  <div class="msub">Sign in to your Folio account</div>
  <label class="form-lbl">Email</label>
  <input class="form-inp" type="email" placeholder="you@email.com">
  <label class="form-lbl">Password</label>
  <input class="form-inp" type="password" placeholder="••••••••">
  <button class="mfull" onclick="closeMod(); toast('Welcome back! 👋')">Sign In</button>
  <div class="modal-sw">No account? <span onclick="openMod('signup')">Sign up free</span></div>`;

const signupHTML = `
  <h2>Join Folio</h2>
  <div class="msub">Create your free account today</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
    <div><label class="form-lbl">First</label><input class="form-inp" type="text" placeholder="Ada"></div>
    <div><label class="form-lbl">Last</label><input class="form-inp" type="text" placeholder="Lovelace"></div>
  </div>
  <label class="form-lbl">Email</label>
  <input class="form-inp" type="email" placeholder="you@email.com">
  <label class="form-lbl">Password</label>
  <input class="form-inp" type="password" placeholder="Create a password">
  <button class="mfull" onclick="closeMod(); toast('Account created! Happy reading 📚')">Create Account</button>
  <div class="modal-sw">Already a member? <span onclick="openMod('login')">Log in</span></div>`;

function openMod(type) {
  document.getElementById('mod-content').innerHTML = type === 'login' ? loginHTML : signupHTML;
  document.getElementById('mod-bg').classList.add('open');
}
function closeMod() {
  document.getElementById('mod-bg').classList.remove('open');
}

/* ── Contact Submit ── */
function submitContact() {
  toast('Message sent! We\'ll reply within 24 hours.');
  // In production: POST to your Lambda API
  // fetch('/api/contact', { method: 'POST', body: JSON.stringify({...}) })
}

/* ── Toast ── */
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast2');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', init);
