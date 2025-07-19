let isAdmin = false;

function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  
  products.forEach(p => {
    const isAdminUI = isAdmin ? \`
      <button onclick="editProduct(${p.id})">Edit</button>
      <button onclick="deleteProduct(${p.id})">Hapus</button>
    \` : '';

    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="/uploads/${p.image}" />
      <h3>${p.name}</h3>
      <p>Rp ${p.price.toLocaleString()}</p>
      <p>${p.desc}</p>
    `;
    div.innerHTML += isAdminUI;
    container.appendChild(div);
  });
}

function adminLogin() {
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;
  if (u === 'admin' && p === 'secondchance') {
    isAdmin = true;
    document.getElementById('add-button').style.display = 'block';
    showSection('store');
  } else {
    document.getElementById('login-msg').textContent = 'Login gagal.';
  }
}

function showAddForm() {
  document.getElementById('add-form').style.display = 'block';
}

async function addProduct() {
  const name = document.getElementById('new-name').value;
  const price = document.getElementById('new-price').value;
  const desc = document.getElementById('new-desc').value;
  const image = document.getElementById('new-image').files[0];

  const formData = new FormData();
  formData.append('image', image);
  const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
  const { filename } = await uploadRes.json();

  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, desc, image: filename })
  });

  alert('Produk ditambahkan!');
  loadProducts();
}
loadProducts();

async function editProduct(id) {
  const name = prompt("Nama baru:");
  const price = prompt("Harga baru:");
  const desc = prompt("Deskripsi baru:");
  await fetch('/api/products/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, desc })
  });
  alert("Produk diperbarui!");
  loadProducts();
}

async function deleteProduct(id) {
  if (confirm("Yakin hapus produk ini?")) {
    await fetch('/api/products/' + id, { method: 'DELETE' });
    alert("Produk dihapus!");
    loadProducts();
  }
}
