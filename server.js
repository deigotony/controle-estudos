import express from 'express';
import { conectarBanco, inicializarBanco } from './database.js';

const app = express();
const porta = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

inicializarBanco();

app.post('/salvar', async (req, res) => {
    const { data, enem, obmep1, obmep2, tempo } = req.body;
    
    try {
        const db = await conectarBanco();
        await db.run(
            `INSERT INTO registros_estudo 
            (data_estudo, questoesENEM, questoesOBMEP1, questoesOBMEP2, tempo_estudo_minutos)
            VALUES (?, ?, ?, ?, ?)`, 
            [data, enem, obmep1, obmep2, tempo]
        );
        await db.close();
        res.status(200).json({ mensagem: "Dados salvos com sucesso!" });
    } catch (erro) {
        console.error("Erro no Banco:", erro);
        res.status(500).json({ erro: "Erro ao salvar no banco." });
    }
});

app.get('/historico', async (req, res) => {
    try {
        const db = await conectarBanco();
        const dados = await db.all('SELECT * FROM registros_estudo ORDER BY data_estudo DESC');
        await db.close();
        res.json(dados);
    } catch (erro) {
        console.error("Erro ao buscar:", erro);
        res.status(500).json({ erro: "Erro ao buscar dados." });
    }
});

app.listen(porta, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${porta}`);
});
