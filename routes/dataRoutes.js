const express = require('express');
const dbConnection = require('./../database/Config');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const upload = multer();

/* Crear la tarjeta de credito por medio de un post */
router.post("/CrearTarjeta", (req, res) => {
    const rutaEspecifica = path.join(__dirname, '..', 'tarjeta', 'tarjeta.txt');

    const informacion = {
        Nombre: req.body.Nombre,
        Saldo: req.body.Saldo,
        NumeroTarjeta: req.body.NumeroTarjeta,
        Contrasena: req.body.Contrasena,
    };

    const informacionTexto = JSON.stringify(informacion, null, 2);
    fs.writeFile(rutaEspecifica, informacionTexto, (err) => {
        if (err) {
            console.error('Error al guardar la información:', err);
            res.status(500).json({
                status: false,
                message: 'Error interno del servidor'
                });
        } else {
            console.log('Información guardada exitosamente en:', rutaEspecifica);
            res.status(200).json({
                status: true,
                message: 'Información guardada exitosamente'
                });
        }
    });
});

router.post("/Login", (req, res) =>{
    const { usuario, contrasenia } = req.body;
    const query = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';
    dbConnection.query(query, [usuario, contrasenia], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).json({
                status: false,
                message: 'Error interno del servidor'
                });
        } else {
            if (results.length > 0) {
                res.status(200).json({
                    status: true,
                    message: 'Inicio de sesión exitoso'
                    });
            } else {
                res.status(401).json({
                    status: false,
                    message: 'Usuario o contraseña incorrectos'
                    });
            }
        }
    });
})

router.post("/ActualizarSaldo", (req, res) =>{
    const { numeroCuenta, nombre, valor, IdUsuario } = req.body;
    const obtenerSaldoQuery = 'SELECT Saldo FROM cuenta WHERE NumCuenta = ?';
    dbConnection.query(obtenerSaldoQuery, [numeroCuenta], (err, results) => {
        if (err) {
            console.error('Error al obtener el saldo:', err);
            res.status(500).json({
                status: false,
                message: 'Error interno del servidor'
                });
        } else {
            if (results.length > 0) {
                const saldoActual = results[0].saldo;
                const nuevoSaldo = saldoActual + parseFloat(valor);
                const actualizarSaldoQuery = 'UPDATE cuenta SET Saldo = ? WHERE NumCuenta = ?';
                dbConnection.query(actualizarSaldoQuery, [nuevoSaldo, numeroCuenta], (err) => {
                    if (err) {
                        console.error('Error al actualizar el saldo:', err);
                        res.status(500).json({
                            status: false,
                            message: 'Error interno del servidor'
                            });
                    } else {
                        res.status(200).json({ status: true, mensaje: 'Depósito realizado exitosamente', nuevoSaldo });
                    }
                });
            } else {
                res.status(404).json({
                    status: false,
                    message: 'Número de cuenta no encontrado'
                    });
            }
        }
    });
});

router.post("/MostrarSaldo",(req, res) =>{
    const { numeroCuenta, IdUsuario } = req.body;
    const obtenerSaldoQuery = 'SELECT Saldo FROM cuenta c, usuario u WHERE c.IdUsuario == u.IdUsuario AND c.NumCuenta = ? AND u.IdUsuario = ?';
    dbConnection.query(obtenerSaldoQuery, [numeroCuenta, IdUsuario], (err, results) =>{
        if (err) {
            console.error('Error al obtener el saldo:', err);
            res.status(500).json({
                status: false,
                message: 'Error interno del servidor'
                });
        } else {
            if (results.length > 0){
                const saldoActual = results[0].saldo;
                res.status(200).json({ 
                    status: true, 
                    mensaje: 'Depósito realizado exitosamente', 
                    Saldo: saldoActual });
            }else {
                res.status(404).json({
                    status: false,
                    message: 'Número de cuenta o usuario no encontrado'
                    });
            }
        }
    })
})

module.exports = router;