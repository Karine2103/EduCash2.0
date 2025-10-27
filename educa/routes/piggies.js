const express = require('express');
const db = require('../database');

const router = express.Router();

// GET /piggies - Lista todos os cofrinhos do usuário (user_id fixo 1 por enquanto)
router.get('/', (req, res) => {
  db.all('SELECT * FROM piggies WHERE user_id = 1', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST /piggies - Cria um novo cofrinho
router.post('/', (req, res) => {
  const { name, icon, color, goal } = req.body;
  db.run(
    'INSERT INTO piggies (user_id, name, icon, color, goal) VALUES (1, ?, ?, ?, ?)',
    [name, icon, color, goal],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// PUT /piggies/:id - Atualiza um cofrinho
router.put('/:id', (req, res) => {
  const { name, icon, color, goal } = req.body;
  db.run(
    'UPDATE piggies SET name = ?, icon = ?, color = ?, goal = ? WHERE id = ? AND user_id = 1',
    [name, icon, color, goal, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ changes: this.changes });
    }
  );
});

// DELETE /piggies/:id - Deleta um cofrinho
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM piggies WHERE id = ? AND user_id = 1', req.params.id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Também deleta as transações associadas
    db.run('DELETE FROM transactions WHERE piggy_id = ?', req.params.id);
    res.json({ changes: this.changes });
  });
});

// GET /piggies/:id/transactions - Lista transações de um cofrinho
router.get('/:id/transactions', (req, res) => {
  db.all('SELECT * FROM transactions WHERE piggy_id = ? ORDER BY date DESC', req.params.id, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST /piggies/:id/transactions - Adiciona uma transação a um cofrinho
router.post('/:id/transactions', (req, res) => {
  const { amount, description } = req.body;
  db.run(
    'INSERT INTO transactions (piggy_id, amount, description) VALUES (?, ?, ?)',
    [req.params.id, amount, description],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

module.exports = router;