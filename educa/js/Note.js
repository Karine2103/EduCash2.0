// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'cofrinhos.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper para ler dados do arquivo
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { cofrinhos: [] };
  }
}

// Helper para escrever dados no arquivo
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Rotas da API

// GET /cofrinhos - Listar todos os cofrinhos
app.get('/cofrinhos', (req, res) => {
  const data = readData();
  res.json(data.cofrinhos);
});

// POST /cofrinhos - Criar um novo cofrinho
app.post('/cofrinhos', (req, res) => {
  const { name, icon, color, goal } = req.body;
  const data = readData();
  
  const newCofrinho = {
    id: Date.now().toString(),
    name,
    icon,
    color,
    goal: goal ? parseFloat(goal) : null,
    deposits: [],
    createdAt: new Date().toISOString()
  };
  
  data.cofrinhos.push(newCofrinho);
  writeData(data);
  
  res.status(201).json(newCofrinho);
});

// GET /cofrinhos/:id - Obter um cofrinho específico
app.get('/cofrinhos/:id', (req, res) => {
  const data = readData();
  const cofrinho = data.cofrinhos.find(c => c.id === req.params.id);
  
  if (!cofrinho) {
    return res.status(404).json({ error: 'Cofrinho não encontrado' });
  }
  
  res.json(cofrinho);
});

// PUT /cofrinhos/:id - Atualizar um cofrinho
app.put('/cofrinhos/:id', (req, res) => {
  const { name, icon, color, goal } = req.body;
  const data = readData();
  const cofrinhoIndex = data.cofrinhos.findIndex(c => c.id === req.params.id);
  
  if (cofrinhoIndex === -1) {
    return res.status(404).json({ error: 'Cofrinho não encontrado' });
  }
  
  data.cofrinhos[cofrinhoIndex] = {
    ...data.cofrinhos[cofrinhoIndex],
    name: name || data.cofrinhos[cofrinhoIndex].name,
    icon: icon || data.cofrinhos[cofrinhoIndex].icon,
    color: color || data.cofrinhos[cofrinhoIndex].color,
    goal: goal ? parseFloat(goal) : data.cofrinhos[cofrinhoIndex].goal
  };
  
  writeData(data);
  res.json(data.cofrinhos[cofrinhoIndex]);
});

// DELETE /cofrinhos/:id - Excluir um cofrinho
app.delete('/cofrinhos/:id', (req, res) => {
  const data = readData();
  const cofrinhoIndex = data.cofrinhos.findIndex(c => c.id === req.params.id);
  
  if (cofrinhoIndex === -1) {
    return res.status(404).json({ error: 'Cofrinho não encontrado' });
  }
  
  data.cofrinhos.splice(cofrinhoIndex, 1);
  writeData(data);
  res.status(204).send();
});

// POST /cofrinhos/:id/deposits - Adicionar um depósito
app.post('/cofrinhos/:id/deposits', (req, res) => {
  const { amount } = req.body;
  const data = readData();
  const cofrinhoIndex = data.cofrinhos.findIndex(c => c.id === req.params.id);
  
  if (cofrinhoIndex === -1) {
    return res.status(404).json({ error: 'Cofrinho não encontrado' });
  }
  
  const newDeposit = {
    id: Date.now().toString(),
    amount: parseFloat(amount),
    date: new Date().toISOString()
  };
  
  data.cofrinhos[cofrinhoIndex].deposits.push(newDeposit);
  writeData(data);
  res.status(201).json(newDeposit);
});

// DELETE /cofrinhos/:id/deposits/:depositId - Remover um depósito
app.delete('/cofrinhos/:id/deposits/:depositId', (req, res) => {
  const data = readData();
  const cofrinhoIndex = data.cofrinhos.findIndex(c => c.id === req.params.id);
  
  if (cofrinhoIndex === -1) {
    return res.status(404).json({ error: 'Cofrinho não encontrado' });
  }
  
  const depositIndex = data.cofrinhos[cofrinhoIndex].deposits.findIndex(
    d => d.id === req.params.depositId
  );
  
  if (depositIndex === -1) {
    return res.status(404).json({ error: 'Depósito não encontrado' });
  }
  
  data.cofrinhos[cofrinhoIndex].deposits.splice(depositIndex, 1);
  writeData(data);
  res.status(204).send();
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});