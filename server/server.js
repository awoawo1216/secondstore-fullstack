const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../client')));

const DATA_PATH = path.join(__dirname, 'products.json');

// Upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'server/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
app.get('/api/products', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  res.json(data);
});

app.post('/api/products', (req, res) => {
  const products = JSON.parse(fs.readFileSync(DATA_PATH));
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2));
  res.json({ success: true });
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  res.json({ filename: req.file.filename });
});


app.put('/api/products/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(DATA_PATH));
  const updated = products.map(p => p.id == req.params.id ? { ...p, ...req.body } : p);
  fs.writeFileSync(DATA_PATH, JSON.stringify(updated, null, 2));
  res.json({ success: true });
});

app.delete('/api/products/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(DATA_PATH));
  const filtered = products.filter(p => p.id != req.params.id);
  fs.writeFileSync(DATA_PATH, JSON.stringify(filtered, null, 2));
  res.json({ success: true });
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));