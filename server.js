const express = require('express'); //Importa o framework Express, ou seja, o servidor web
const sqlite3 = require('sqlite3').verbose(); //Importa o módulo SQLite3, ou seja, o banco de dados
const cors = require('cors'); //Importa o middleware CORS, serve para permitir requisições de diferentes origens

const app = express(); //Cria uma instância do aplicativo Express
app.use(cors()); //Habilita o CORS para todas as rotas
app.use(express.json()); //Permite que o servidor entenda requisições com corpo em JSON
app.use(express.static('public')); //Servir arquivos estáticos da pasta 'public'

// Inicializa o SQLite
const db = new sqlite3.Database('./banco.db');

// Cria a tabela 'movimentacoes' se ela não existir
db.run(`
    CREATE TABLE IF NOT EXISTS movimentacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT,
        data TEXT,
        valor REAL,
        descricao TEXT
    )
`);

//
app.get('/movimentacoes', (req, res) => {
  db.all('SELECT * FROM movimentacoes', [], (err, rows) => {
    if (err) {
        res.status(500).json(err);
        return;
    }
    res.json(rows);
  });
});

// Rota para obter todas as movimentações
app.post('/movimentacoes', (req, res) => {
    const { tipo, data, valor, descricao } = req.body;

    // Insere uma nova movimentação no banco de dados
    db.run(
        'INSERT INTO movimentacoes (tipo, data, valor, descricao) VALUES (?, ?, ?, ?)',
        [tipo, data, valor, descricao],
    );

    // Retorna uma resposta de sucesso
    res.sendStatus(200);
});

app.delete('/movimentacoes/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM movimentacoes WHERE id = ?', [id]);
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});