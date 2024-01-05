const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const dataRoutes = require('./routes/dataRoutes');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/Cajero/', dataRoutes);
const port = 3000; // Cambia esto al puerto que desees utilizar
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});