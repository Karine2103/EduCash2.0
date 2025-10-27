const express = require('express');
const db = require('../database');

const router = express.Router();

// DELETE /transactions/:id - Deleta uma transação
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM transactions WHERE id = ?', req.params.id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ changes: this.changes });
  });
});

module.exports = router;
