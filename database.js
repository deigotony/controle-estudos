import sqlite3 from 'sqlite3';
import {open} from 'sqlite';

export async function conectarBanco () {
    return open ({
        filename: './banco.db',
        driver: sqlite3.Database,
    });
}

export async function inicializarBanco () {
    const db = await conectarBanco();
    await db.run(`
        CREATE TABLE IF NOT EXISTS registros_estudo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data_estudo TEXT,
            questoesENEM INTEGER,
            questoesOBMEP1 INTEGER,
            questoesOBMEP2 INTEGER,
            tempo_estudo_minutos INTEGER
        )
    `);
    await db.close();
}

