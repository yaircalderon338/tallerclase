// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres.ftexcuobkyazqjozjsfv',
  host: 'aws-0-us-east-1.pooler.supabase.com',
  database: 'postgres',
  password: '6noXo7R0MNUQhTmP',
  port: 5432,
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones seguras con Supabase
  }
});

// Verificación de la conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar con Supabase:', err.stack);
  } else {
    console.log('Conectado exitosamente a Supabase');
    release();
  }
});

module.exports = pool;


