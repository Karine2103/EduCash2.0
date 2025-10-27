const express = require('express');
const cors = require('cors');
const piggiesRoutes = require('./routes/piggies');
const transactionsRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/piggies', piggiesRoutes);
app.use('/transactions', transactionsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});