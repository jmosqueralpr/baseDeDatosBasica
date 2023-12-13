const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cileran11',
    database: 'notasdb'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conexión a la base de datos establecida');
});

// Configuración del middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Rutas
app.get('/', (req, res) => {
    // Mostrar todas las notas
    db.query('SELECT * FROM notas', (err, result) => {
        if (err) throw err;
        res.render('index', { notas: result });
    });
});

app.post('/guardar', (req, res) => {
    // Guardar nueva nota
    const { titulo, contenido, dia, horario } = req.body;
    const nota = { titulo, contenido, dia, horario };

    db.query('INSERT INTO notas SET ?', nota, (err, result) => {
        if (err) throw err;
        console.log('Nota guardada con éxito');
        res.redirect('/');
    });
});

app.get('/editar/:id', (req, res) => {
    // Mostrar la nota a editar
    const notaId = req.params.id;
    db.query('SELECT * FROM notas WHERE id = ?', [notaId], (err, result) => {
        if (err) throw err;
        res.render('editar', { nota: result[0] });
    });
});

app.post('/editar/:id', (req, res) => {
    // Actualizar la nota
    const notaId = req.params.id;
    const { titulo, contenido, dia, horario } = req.body;
    const nota = { titulo, contenido, dia, horario };

    db.query('UPDATE notas SET ? WHERE id = ?', [nota, notaId], (err, result) => {
        if (err) throw err;
        console.log('Nota actualizada con éxito');
        res.redirect('/');
    });
});

app.get('/eliminar/:id', (req, res) => {
    // Eliminar la nota
    const notaId = req.params.id;
    db.query('DELETE FROM notas WHERE id = ?', [notaId], (err, result) => {
        if (err) throw err;
        console.log('Nota eliminada con éxito');
        res.redirect('/');
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
