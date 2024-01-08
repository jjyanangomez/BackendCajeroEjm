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
    const query = 'SELECT c.NumCuenta,u.* FROM usuario u, cuenta c WHERE u.IdUsuario = c.IdUsuario AND u.Usuario = ? AND u.Contrasenia = ?;';
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
                    message: 'Inicio de sesión exitoso',
                    parametro: results[0].IdUsuario,
                    parametro2: results[0].NumCuenta
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
    const { numeroCuenta, valor} = req.body;
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
                const saldoActual = results[0].Saldo;
                const nuevoSaldo = saldoActual + valor;
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

router.post("/Depositar", (req, res) =>{
    const { numeroCuenta, valor,numeroCuentaDescontar} = req.body;
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
                const saldoActual = results[0].Saldo;
                const nuevoSaldo = saldoActual + valor;
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
    dbConnection.query(obtenerSaldoQuery, [numeroCuentaDescontar], (err,results) =>{
        if (err) {
            console.error('Error al obtener el saldo:', err);
            res.status(500).json({
                status: false,
                message: 'Error interno del servidor'
                });
        } else {
            if (results.length > 0) {
                const saldoActual = results[0].Saldo;
                const nuevoSaldo = saldoActual - valor;
                const actualizarSaldoQuery = 'UPDATE cuenta SET Saldo = ? WHERE NumCuenta = ?';
                dbConnection.query(actualizarSaldoQuery, [nuevoSaldo, numeroCuentaDescontar], (err) => {
                    if (err) {
                        console.error('Error al actualizar el saldo:', err);
                        res.status(500).json({
                            status: false,
                            message: 'Error interno del servidor'
                            });
                    } else {
                        res.status(200);
                    }
                });
            }else {
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
    const obtenerSaldoQuery = 'SELECT Saldo FROM cuenta c, usuario u WHERE c.IdUsuario = u.IdUsuario AND c.NumCuenta = ? AND u.IdUsuario = ?';
    dbConnection.query(obtenerSaldoQuery, [numeroCuenta, IdUsuario], (err, results) =>{
        if (err) {
            console.error('Error al obtener el saldo:', err);
            res.status(500).json({
                status: false,
                message: 'Error interno del servidor'
                });
        } else {
            if (results.length > 0){
                const saldoActual = results[0].Saldo;
                res.status(200).json({ 
                    status: true, 
                    mensaje: 'Consulta realiza exitosamente', 
                    Saldo: saldoActual });
            }else {
                res.status(404).json({
                    status: false,
                    message: 'Error al realizar la consulta'
                    });
            }
        }
    })
})
router.get("/LeerTarjeta",(req, res) =>{
    const rutaArchivo = './tarjeta/tarjeta.txt';
    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).json({
                status: false,
                message: 'Error al leer el archivo:', err
                });
        } else {
            try {
                // Analizar el contenido como JSON
                const informacion = JSON.parse(data);
    
                // Hacer algo con la información, por ejemplo, imprimir en la consola
                console.log('Información del archivo:', informacion);
                res.status(200).json({ 
                    status: true, 
                    informacion: informacion });

            } catch (error) {
                console.error('Error al analizar el contenido como JSON:', error);
                res.status(500).json({
                    status: false,
                    message: 'Error al analizar el contenido como JSON:', error
                    });
            }
        }
    });
})
module.exports = router;