const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// uso de msql2 
const mysql = require('mysql2');

app.use(bodyParser.json({ type: 'application/json' }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'jUan123...',  // tu contraseña
    database: 'db_curso_app'  // nombre de la base de datos
});

connection.connect(function (err) {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

app.get('/', function (req, res) {
    res.send('Hello World desde juan-servidor');
});

// Ruta para obtener todos los registros de la tabla persona
app.get('/persona', function (req, res) {
    connection.query('SELECT * FROM persona', function (error, results, fields) {
        if (error) {
            console.error('Error en la consulta a la base de datos:', error);
            res.status(500).send('Error en la consulta a la base de datos: ' + error.message);
            return;
        }
        res.json({
            personas: results
        });
    });
});

// Insertar un nuevo registro en la tabla persona
app.post('/persona', function (req, res) {
    const { cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion } = req.body;
    const query = 'INSERT INTO persona (cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion], function (error, results) {
        if (error) {
            console.error('Error al insertar en la base de datos:', error);
            res.status(500).send('Error al insertar en la base de datos: ' + error.message);
            return;
        }
        res.status(201).send('Registro insertado con éxito');
    });
});

// Actualizar un registro existente en la tabla persona
app.put('/persona/:id', function (req, res) {
    const { id } = req.params;
    const { cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion } = req.body;
    const query = 'UPDATE persona SET cedula = ?, nombres = ?, apellidos = ?, fecha_nacimiento = ?, telefono = ?, direccion = ? WHERE idpersona = ?';
    connection.query(query, [cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion, id], function (error, results) {
        if (error) {
            console.error('Error al actualizar en la base de datos:', error);
            res.status(500).send('Error al actualizar en la base de datos: ' + error.message);
            return;
        }
        res.send('Registro actualizado con éxito');
    });
});

// Eliminar un registro de la tabla persona
app.delete('/persona/:id', function (req, res) {
    const { id } = req.params;
    const query = 'DELETE FROM persona WHERE idpersona = ?';
    connection.query(query, [id], function (error, results) {
        if (error) {
            console.error('Error al eliminar en la base de datos:', error);
            res.status(500).send('Error al eliminar en la base de datos: ' + error.message);
            return;
        }
        res.send('Registro eliminado con éxito');
    });
});

// Seleccionar los  registros con una condición en este caso, por cedula
app.get('/persona/cedula/:cedula', function (req, res) {
    const { cedula } = req.params;
    const query = 'SELECT * FROM persona WHERE cedula = ?';
    connection.query(query, [cedula], function (error, results, fields) {
        if (error) {
            console.error('Error en la consulta a la base de datos:', error);
            res.status(500).send('Error en la consulta a la base de datos: ' + error.message);
            return;
        }
        res.json({
            personas: results
        });
    });
});

app.listen(3000, () => {
    console.log("Servidor iniciado en el puerto: 3000");
});
