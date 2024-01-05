const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost', // Cambia esto si tu base de datos está en otro servidor
  user: 'root', // Cambia esto al usuario de tu base de datos
  password: '', // Cambia esto a la contraseña de tu base de datos
  database: 'sistemaevagamific', // Cambia esto al nombre de tu base de datos
  port: 3306,
  charset: 'utf8mb4'
});

connection.connect(error => {
  if (error) throw error;
  console.log('Conexión exitosa a la base de datos MySQL');
});

module.exports = connection;